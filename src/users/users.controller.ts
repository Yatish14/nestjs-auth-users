import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';

interface JwtUser
{
    userId: number,
    email: string
}


@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}
    private authorizeUser(
        requestedUserId: number,
        loggedInUserId: number,
    ) {
        if (requestedUserId !== loggedInUserId) {
            throw new ForbiddenException('You can only modify your own account');
        }
    }
    
    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@Request() req: Request & { user: JwtUser }) {
        return req.user;
    }
    
    @Get()
    @UseGuards(JwtAuthGuard)
    getAllUsers() {
        return this.userService.findAllUsers()
    }
    
    @Post()
    createUser(
        @Body() createUserDto: CreateUserDto
    ) {
        return this.userService.createUser(createUserDto)
    }
    
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updateUserById(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @Request() req: Request & {  user: JwtUser },
    ) {        
        this.authorizeUser(id, req.user.userId);

        return this.userService.updateUserById(Number(id), updateUserDto)
    }
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    deleteUserById(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: Request & {  user: JwtUser },
    ) {        
        this.authorizeUser(id, req.user.userId);

        return this.userService.deleteUserById(Number(id))
    }
}
