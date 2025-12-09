import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { CreateTicketDto } from './create-ticket.dto';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @IsOptional()
    @IsEnum(TicketStatus, { message: 'El estado debe ser un valor válido' })
    status?: TicketStatus;

    @IsOptional()
    @IsUUID('4', { message: 'El ID de técnico debe ser un UUID válido' })
    technicianId?: string;
}
