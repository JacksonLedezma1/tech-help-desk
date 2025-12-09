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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({
        type: CreateUserDto,
        examples: {
            default: {
                summary: 'User payload',
                value: {
                    email: 'user.swagger@example.com',
                    password: 'password123',
                    name: 'User Swagger',
                    role: 'client',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully created.',
        schema: {
            example: {
                success: true,
                data: {
                    email: 'user.swagger@example.com',
                    name: 'User Swagger',
                    role: 'client',
                },
                message: 'Request successful',
            },
        },
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'List all users' })
    @ApiResponse({
        status: 200,
        description: 'Return all users.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        email: 'admin.swagger@example.com',
                        name: 'Admin Swagger',
                        role: 'admin',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the user.',
        schema: {
            example: {
                success: true,
                data: {
                    email: 'client.swagger@example.com',
                    name: 'Client Swagger',
                    role: 'client',
                },
                message: 'Request successful',
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({
        type: UpdateUserDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    name: 'Client Swagger Updated',
                    role: 'technician',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    email: 'client.swagger@example.com',
                    name: 'Client Swagger Updated',
                    role: 'technician',
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({
        status: 200,
        description: 'User successfully deleted.',
        schema: {
            example: {
                success: true,
                data: null,
                message: 'Request successful',
            },
        },
    })
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
