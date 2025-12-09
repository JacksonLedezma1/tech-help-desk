import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'El nombre de la categoría es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto' })
    description?: string;
}
