import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateStatusDto {
    @IsNotEmpty({ message: 'El estado es requerido' })
    @IsEnum(TicketStatus, { message: 'El estado debe ser un valor válido (abierto, en_progreso, resuelto, cerrado)' })
    status: TicketStatus;
}
