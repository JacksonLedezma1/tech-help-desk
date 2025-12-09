import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClientDto {
    @ApiProperty({ example: 'Juan Perez', description: 'Nombre del cliente' })
    @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @ApiPropertyOptional({ example: 'Acme Corp', description: 'Empresa del cliente' })
    @IsOptional()
    @IsString({ message: 'La empresa debe ser un texto' })
    company?: string;

    @ApiProperty({ example: 'contacto@acme.com', description: 'Correo de contacto' })
    @IsNotEmpty({ message: 'El email de contacto es requerido' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    contactEmail: string;
}
