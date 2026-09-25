import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    async findAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        })
    }

    async createUser(createUserDto: CreateUserDto) {

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword
            }
        })
    }

    async updateUserById(id: number, updateUserDto: UpdateUserDto) {
        const updatedUserData = {
            ...updateUserDto,
        }

        if(updateUserDto.password)
        {
            updatedUserData.password = await bcrypt.hash(updateUserDto.password, 10)
        }

        return this.prisma.user.update({
            where: {
                id
            },
            data: updatedUserData
        })
    }

    async deleteUserById(id: number) {
        return this.prisma.user.delete({
            where: {
                id
            }
        })
    }
}
