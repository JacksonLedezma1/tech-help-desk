import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';

@ApiTags('Tickets')
@ApiBearerAuth()
@Controller('tickets')
@UseGuards(JwtGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new ticket' })
    @ApiBody({
        type: CreateTicketDto,
        examples: {
            default: {
                summary: 'Completa con tus UUID reales',
                value: {
                    title: 'Problem with Swagger printer',
                    description: 'The printer is not responding to Swagger and shows error 50.',
                    categoryId: 'coloca-aqui-tu-uuid-de-categoria',
                    clientId: 'coloca-aqui-tu-uuid-de-cliente',
                    priority: 'high',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Ticket successfully created.',
        schema: {
            example: {
                success: true,
                data: {
                    title: 'Problem with Swagger printer',
                    description: 'The printer is not responding to Swagger and shows error 50.',
                    categoryId: '3d5c3e4f-1a2b-4c5d-9e8f-7a6b5c4d3e2f',
                    clientId: '8b4e2f4b-8f8f-4a4e-9f9f-1a2b3c4d5e6f',
                    status: 'open',
                    priority: 'high',
                },
                message: 'Request successful',
            },
        },
    })
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'List all tickets' })
    @ApiResponse({
        status: 200,
        description: 'Return all tickets.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        title: 'Problem with Swagger printer',
                        description: 'The printer is not responding to Swagger and shows error 50.',
                        status: 'open',
                        priority: 'high',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get('my-tickets')
    @Roles(Role.CLIENT, Role.ADMIN)
    @ApiOperation({ summary: 'List tickets created by the authenticated client' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets of the current client.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        title: 'Problem with Swagger printer',
                        description: 'The printer is not responding to Swagger and shows error 50.',
                        status: 'open',
                        priority: 'high',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    getMyTickets(@CurrentUser() user: User) {
        return this.ticketsService.findByClient(user.id);
    }

    @Get('assigned')
    @Roles(Role.TECHNICIAN, Role.ADMIN)
    @ApiOperation({ summary: 'List tickets assigned to the authenticated technician' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets assigned to the current technician.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        title: 'Problem with Swagger printer',
                        description: 'The printer is not responding to Swagger and shows error 50.',
                        status: 'in_progress',
                        priority: 'high',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    getAssignedTickets(@CurrentUser() user: User) {
        return this.ticketsService.findByTechnician(user.id);
    }

    @Get('client/:id')
    @Roles(Role.ADMIN, Role.CLIENT)
    @ApiOperation({ summary: 'List tickets by client ID' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets for the given client.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        title: 'Problem with Swagger printer',
                        description: 'The printer is not responding to Swagger and shows error 50.',
                        status: 'open',
                        priority: 'high',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    getTicketsByClient(@Param('id') clientId: string) {
        return this.ticketsService.findByClient(clientId);
    }

    @Get('technician/:id')
    @Roles(Role.ADMIN, Role.TECHNICIAN)
    @ApiOperation({ summary: 'List tickets by technician ID' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets assigned to the given technician.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        title: 'Problem with Swagger printer',
                        description: 'The printer is not responding to Swagger and shows error 50.',
                        status: 'in_progress',
                        priority: 'high',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    getTicketsByTechnician(@Param('id') technicianId: string) {
        return this.ticketsService.findByTechnician(technicianId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get ticket by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the ticket.',
        schema: {
            example: {
                success: true,
                data: {
                    title: 'Problem with Swagger printer',
                    description: 'The printer is not responding to Swagger and shows error 50.',
                    status: 'open',
                    priority: 'high',
                },
                message: 'Request successful',
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a ticket' })
    @ApiBody({
        type: UpdateTicketDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    title: 'Problem with Swagger printer',
                    priority: 'medium',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Ticket successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    title: 'Problem with Swagger printer',
                    description: 'The printer is not responding to Swagger and shows error 50.',
                    status: 'open',
                    priority: 'medium',
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto);
    }

    @Patch(':id/status')
    @Roles(Role.TECHNICIAN, Role.ADMIN)
    @ApiOperation({ summary: 'Update the status of a ticket' })
    @ApiBody({
        type: UpdateStatusDto,
        examples: {
            default: {
                summary: 'Status payload',
                value: {
                    status: 'in_progress',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Ticket status successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    status: 'in_progress',
                },
                message: 'Request successful',
            },
        },
    })
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
        return this.ticketsService.updateStatus(id, updateStatusDto);
    }

    @Patch(':id/assign')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Assign a technician to a ticket' })
    @ApiBody({
        type: AssignTechnicianDto,
        examples: {
            default: {
                summary: 'Assignment payload',
                value: {
                    technicianId: '1f3d6a7b-2c4e-5f6a-8b9c-0d1e2f3a4b5c',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Technician successfully assigned.',
        schema: {
            example: {
                success: true,
                data: {
                    technicianId: '1f3d6a7b-2c4e-5f6a-8b9c-0d1e2f3a4b5c',
                },
                message: 'Request successful',
            },
        },
    })
    assignTechnician(@Param('id') id: string, @Body() assignTechnicianDto: AssignTechnicianDto) {
        return this.ticketsService.assignTechnician(id, assignTechnicianDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a ticket' })
    @ApiResponse({
        status: 200,
        description: 'Ticket successfully deleted.',
        schema: {
            example: {
                success: true,
                data: null,
                message: 'Request successful',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(id);
    }
}
