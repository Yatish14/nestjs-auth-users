import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto.js';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findUserByEmail(loginDto.email)

        if(!user)
        {
            throw new UnauthorizedException('Invalid email or Password')
        }

        const passwordMatches = await bcrypt.compare(loginDto.password, user.password)

        if(!passwordMatches)
        {
            throw new UnauthorizedException('Invalid email or password')
        }

        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email
        })

        return {
            message: 'Login Successful',
            accessToken
        }
    }
}
