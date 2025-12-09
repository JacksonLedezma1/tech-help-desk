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
                    title: 'Problema con la impresora',
                    description: 'La impresora no responde y muestra error 50.',
                    categoryId: 'coloca-aqui-tu-uuid-de-categoria',
                    clientId: 'coloca-aqui-tu-uuid-de-cliente',
                    priority: 'alta',
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
                    id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                    title: 'Problema con la impresora',
                    description: 'La impresora no responde y muestra error 50.',
                    categoryId: '3d5c3e4f-1a2b-4c5d-9e8f-7a6b5c4d3e2f',
                    clientId: '8b4e2f4b-8f8f-4a4e-9f9f-1a2b3c4d5e6f',
                    status: 'abierto',
                    priority: 'alta',
                },
                message: 'Request successful',
            },
        },
    })
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }

    @Get()
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'List all tickets' })
    @ApiResponse({
        status: 200,
        description: 'Return all tickets.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                        title: 'Problema con la impresora',
                        description: 'La impresora no responde y muestra error 50.',
                        status: 'abierto',
                        priority: 'alta',
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
    @Roles(Role.CLIENTE, Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'List tickets created by the authenticated client' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets of the current client.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                        title: 'Problema con la impresora',
                        description: 'La impresora no responde y muestra error 50.',
                        status: 'abierto',
                        priority: 'alta',
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
    @Roles(Role.TECNICO, Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'List tickets assigned to the authenticated technician' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets assigned to the current technician.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                        title: 'Problema con la impresora',
                        description: 'La impresora no responde y muestra error 50.',
                        status: 'en_progreso',
                        priority: 'alta',
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
    @Roles(Role.ADMINISTRADOR, Role.CLIENTE)
    @ApiOperation({ summary: 'List tickets by client ID' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets for the given client.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                        title: 'Problema con la impresora',
                        description: 'La impresora no responde y muestra error 50.',
                        status: 'abierto',
                        priority: 'alta',
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
    @Roles(Role.ADMINISTRADOR, Role.TECNICO)
    @ApiOperation({ summary: 'List tickets by technician ID' })
    @ApiResponse({
        status: 200,
        description: 'Return tickets assigned to the given technician.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                        title: 'Problema con la impresora',
                        description: 'La impresora no responde y muestra error 50.',
                        status: 'en_progreso',
                        priority: 'alta',
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
                    id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                    title: 'Problema con la impresora',
                    description: 'La impresora no responde y muestra error 50.',
                    status: 'abierto',
                    priority: 'alta',
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
                    title: 'Problema con la impresora',
                    priority: 'media',
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
                    id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                    title: 'Problema con la impresora',
                    description: 'La impresora no responde y muestra error 50.',
                    status: 'abierto',
                    priority: 'media',
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto);
    }

    @Patch(':id/status')
    @Roles(Role.TECNICO, Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Update the status of a ticket' })
    @ApiBody({
        type: UpdateStatusDto,
        examples: {
            default: {
                summary: 'Status payload',
                value: {
                    status: 'en_progreso',
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
                    id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
                    status: 'en_progreso',
                },
                message: 'Request successful',
            },
        },
    })
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
        return this.ticketsService.updateStatus(id, updateStatusDto);
    }

    @Patch(':id/assign')
    @Roles(Role.ADMINISTRADOR)
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
                    id: 'c2b1a3d4-e5f6-7890-abcd-ef1234567890',
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
    @Roles(Role.ADMINISTRADOR)
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
