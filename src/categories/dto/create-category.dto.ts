import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'Hardware Swagger', description: 'Name of the category' })
    @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @ApiProperty({ example: 'Issues related to physical equipment (Swagger)', description: 'Description of the category', required: false })
    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    description?: string;
}
