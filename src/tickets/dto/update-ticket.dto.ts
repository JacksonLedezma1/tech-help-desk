import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTicketDto } from './create-ticket.dto';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
    @ApiPropertyOptional({ example: 'en_progreso', enum: TicketStatus, description: 'Nuevo estado del ticket' })
    @IsOptional()
    @IsEnum(TicketStatus, { message: 'El estado debe ser un valor válido' })
    status?: TicketStatus;

    @ApiPropertyOptional({
        example: '1f3d6a7b-2c4e-5f6a-8b9c-0d1e2f3a4b5c',
        description: 'Identificador del técnico asignado',
    })
    @IsOptional()
    @IsUUID('4', { message: 'El ID de técnico debe ser un UUID válido' })
    technicianId?: string;
}
