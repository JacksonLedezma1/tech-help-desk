import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTechnicianDto {
    @ApiProperty({ example: 'Tech Swagger', description: 'Nombre del técnico' })
    @IsNotEmpty({ message: 'El nombre del técnico es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @ApiPropertyOptional({ example: 'Redes', description: 'Especialidad del técnico' })
    @IsOptional()
    @IsString({ message: 'La especialidad debe ser un texto' })
    specialty?: string;

    @ApiPropertyOptional({ example: true, description: 'Disponibilidad del técnico' })
    @IsOptional()
    @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso' })
    availability?: boolean;
}
