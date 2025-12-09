import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTechnicianDto {
    @ApiProperty({
        example: '1f3d6a7b-2c4e-5f6a-8b9c-0d1e2f3a4b5c',
        description: 'Identificador del técnico a asignar',
    })
    @IsNotEmpty({ message: 'El ID del técnico es requerido' })
    @IsUUID('4', { message: 'El ID del técnico debe ser un UUID válido' })
    technicianId: string;
}
