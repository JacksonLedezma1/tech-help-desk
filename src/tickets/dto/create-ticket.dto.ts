import { IsNotEmpty, IsString, IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
    @ApiProperty({ example: 'Problem with the printer', description: 'Ticket title' })
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    title: string;

    @ApiProperty({
        example: 'The printer is not responding and shows error 50.',
        description: 'Detailed description of the problem',
    })
    @IsNotEmpty({ message: 'Description is required' })
    @IsString({ message: 'Description must be a string' })
    description: string;

    @ApiProperty({
        example: 'uuid-existing-category',
        description: 'UUID of the existing category',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'Category is required' })
    @IsUUID('4', { message: 'Category ID must be a valid UUID' })
    categoryId: string;

    @ApiProperty({
        example: 'uuid-existing-client',
        description: 'UUID of the existing client',
        format: 'uuid',
    })
    @IsNotEmpty({ message: 'Client is required' })
    @IsUUID('4', { message: 'Client ID must be a valid UUID' })
    clientId: string;

    @ApiPropertyOptional({ example: 'high', description: 'Ticket priority' })
    @IsOptional()
    @IsString({ message: 'Priority must be a string' })
    priority?: string;
}
