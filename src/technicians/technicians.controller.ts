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
import { TechniciansService } from './technicians.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Technicians')
@ApiBearerAuth()
@Controller('technicians')
@UseGuards(JwtGuard, RolesGuard)
export class TechniciansController {
    constructor(private readonly techniciansService: TechniciansService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new technician' })
    @ApiBody({
        type: CreateTechnicianDto,
        examples: {
            default: {
                summary: 'Technician payload',
                value: {
                    name: 'Tech Swagger',
                    specialty: 'Redes',
                    availability: true,
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Technician successfully created.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Tech Swagger',
                    specialty: 'Redes',
                    availability: true,
                },
                message: 'Request successful',
            },
        },
    })
    create(@Body() createTechnicianDto: CreateTechnicianDto) {
        return this.techniciansService.create(createTechnicianDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all technicians' })
    @ApiResponse({
        status: 200,
        description: 'Return all technicians.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        name: 'Tech Swagger',
                        specialty: 'Redes',
                        availability: true,
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    findAll() {
        return this.techniciansService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get technician by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the technician.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Tech Swagger',
                    specialty: 'Redes',
                    availability: true,
                },
                message: 'Request successful',
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.techniciansService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a technician' })
    @ApiBody({
        type: UpdateTechnicianDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    specialty: 'Soporte',
                    availability: false,
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Technician successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    name: 'Tech Swagger',
                    specialty: 'Soporte',
                    availability: false,
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateTechnicianDto: UpdateTechnicianDto) {
        return this.techniciansService.update(id, updateTechnicianDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a technician' })
    @ApiResponse({
        status: 200,
        description: 'Technician successfully deleted.',
        schema: {
            example: {
                success: true,
                data: null,
                message: 'Request successful',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.techniciansService.remove(id);
    }
}
