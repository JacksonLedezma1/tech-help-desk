import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';

export class CreateTicketDto {
    @IsNotEmpty({ message: 'El título del ticket es requerido' })
    @IsString({ message: 'El título debe ser un texto' })
    title: string;

    @IsNotEmpty({ message: 'La descripción del ticket es requerida' })
    @IsString({ message: 'La descripción debe ser un texto' })
    description: string;

    @IsNotEmpty({ message: 'La categoría es requerida' })
    @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
    categoryId: string;

    @IsNotEmpty({ message: 'El cliente es requerido' })
    @IsUUID('4', { message: 'El ID de cliente debe ser un UUID válido' })
    clientId: string;

    @IsOptional()
    @IsString({ message: 'La prioridad debe ser un texto' })
    priority?: string;
}
