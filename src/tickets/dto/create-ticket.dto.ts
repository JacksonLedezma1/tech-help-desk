import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiProperty({ example: 'Problema con la impresora', description: 'Título del ticket' })
    @IsNotEmpty({ message: 'El título del ticket es requerido' })
    @IsString({ message: 'El título debe ser un texto' })
    title: string;

    @ApiProperty({
        example: 'La impresora no responde y muestra error 50.',
        description: 'Descripción detallada del problema',
    })
    @IsNotEmpty({ message: 'La descripción del ticket es requerida' })
    @IsString({ message: 'La descripción debe ser un texto' })
    description: string;

    @ApiProperty({
        example: 'uuid-categoria-existente',
        description: 'Identificador UUID de la categoría existente',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'La categoría es requerida' })
    @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
    categoryId: string;

    @ApiProperty({
        example: 'uuid-cliente-existente',
        description: 'Identificador UUID del cliente existente',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'El cliente es requerido' })
    @IsUUID('4', { message: 'El ID de cliente debe ser un UUID válido' })
    clientId: string;

    @ApiPropertyOptional({ example: 'alta', description: 'Prioridad del ticket' })
    @IsOptional()
    @IsString({ message: 'La prioridad debe ser un texto' })
    priority?: string;
}
