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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
@UseGuards(JwtGuard, RolesGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new client' })
    @ApiBody({
        type: CreateClientDto,
        examples: {
            default: {
                summary: 'Client payload',
                value: {
                    name: 'Client Swagger',
                    company: 'Swagger Corp',
                    contactEmail: 'contact@swagger.com',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Client successfully created.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Client Swagger',
                    company: 'Swagger Corp',
                    contactEmail: 'contact@swagger.com',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 409, description: 'Email already exists.' })
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all clients' })
    @ApiResponse({
        status: 200,
        description: 'Return all clients.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        name: 'Client Swagger',
                        company: 'Swagger Corp',
                        contactEmail: 'contact@swagger.com',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get client by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the client.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Client Swagger',
                    company: 'Swagger Corp',
                    contactEmail: 'contact@swagger.com',
                },
                message: 'Request successful',
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a client' })
    @ApiBody({
        type: UpdateClientDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    name: 'Client Swagger',
                    company: 'Swagger Corp',
                    contactEmail: 'contact@swagger.com',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Client successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Client Swagger',
                    company: 'Swagger Corp',
                    contactEmail: 'contact@swagger.com',
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a client' })
    @ApiResponse({
        status: 200,
        description: 'Client successfully deleted.',
        schema: {
            example: {
                success: true,
                data: null,
                message: 'Request successful',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
