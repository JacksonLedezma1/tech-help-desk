import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'user.swagger@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'User Swagger', description: 'User full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: Role, example: Role.CLIENT, description: 'User role' })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}
