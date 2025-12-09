import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateTechnicianDto {
    @IsNotEmpty({ message: 'El nombre del técnico es requerido' })
    @IsString({ message: 'El nombre debe ser un texto' })
    name: string;

    @IsOptional()
    @IsString({ message: 'La especialidad debe ser un texto' })
    specialty?: string;

    @IsOptional()
    @IsBoolean({ message: 'La disponibilidad debe ser verdadero o falso' })
    availability?: boolean;
}
