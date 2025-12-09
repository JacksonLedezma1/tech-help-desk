import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus } from '../../common/enums/ticket-status.enum';

export class UpdateStatusDto {
    @ApiProperty({
        example: TicketStatus.IN_PROGRESS,
        enum: TicketStatus,
        description: 'New ticket status',
    })
    @IsNotEmpty({ message: 'Status is required' })
    @IsEnum(TicketStatus, { message: 'Status must be a valid value (open, in_progress, resolved, closed)' })
    status: TicketStatus;
}
