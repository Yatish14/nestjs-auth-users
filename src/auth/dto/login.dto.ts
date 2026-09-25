import { IsNotEmpty, IsEmail, isNotEmpty } from 'class-validator'

export class LoginDto {
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}