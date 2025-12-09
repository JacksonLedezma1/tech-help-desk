import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignTechnicianDto {
    @IsNotEmpty({ message: 'El ID del técnico es requerido' })
    @IsUUID('4', { message: 'El ID del técnico debe ser un UUID válido' })
    technicianId: string;
}
