import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateStatusDto {
    @ApiProperty({
        example: TicketStatus.EN_PROGRESO,
        enum: TicketStatus,
        description: 'Nuevo estado del ticket',
    })
    @IsNotEmpty({ message: 'El estado es requerido' })
    @IsEnum(TicketStatus, { message: 'El estado debe ser un valor válido (abierto, en_progreso, resuelto, cerrado)' })
    status: TicketStatus;
}
