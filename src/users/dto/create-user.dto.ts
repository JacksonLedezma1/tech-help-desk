import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com', description: 'Correo electrónico del usuario' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Contraseña del usuario (mínimo 6 caracteres)' })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John Doe', description: 'Nombre completo del usuario' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ enum: Role, example: Role.CLIENTE, description: 'Rol del usuario' })
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}
