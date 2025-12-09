import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty({ message: 'El nombre del cliente es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La empresa debe ser un texto' })
    company?: string;

    @IsNotEmpty({ message: 'El email de contacto es requerido' })
    @IsEmail({}, { message: 'Debe ser un email válido' })
    contactEmail: string;
}
