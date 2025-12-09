import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
    @ApiProperty({ example: 'admin.swagger@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'Admin Swagger', description: 'User full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiPropertyOptional({
        example: 'Swagger Corp',
        description: 'Client company (only required for client role)',
    })
    @IsOptional()
    @IsString()
    company?: string;

    @ApiProperty({ enum: Role, required: false, default: Role.CLIENT, description: 'User role' })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}
