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
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({
        type: CreateUserDto,
        examples: {
            default: {
                summary: 'User payload',
                value: {
                    email: 'new.user@example.com',
                    password: 'password123',
                    name: 'New User',
                    role: 'cliente',
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
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'new.user@example.com',
                    name: 'New User',
                    role: 'cliente',
                },
                message: 'Request successful',
            },
        },
    })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'List all users' })
    @ApiResponse({
        status: 200,
        description: 'Return all users.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: '123e4567-e89b-12d3-a456-426614174000',
                        email: 'admin@example.com',
                        name: 'Admin User',
                        role: 'administrador',
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
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the user.',
        schema: {
            example: {
                success: true,
                data: {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'client@example.com',
                    name: 'Client User',
                    role: 'cliente',
                },
                message: 'Request successful',
            },
        },
    })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({
        type: UpdateUserDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    name: 'Client User Updated',
                    role: 'tecnico',
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
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    email: 'client@example.com',
                    name: 'Client User Updated',
                    role: 'tecnico',
                },
                message: 'Request successful',
            },
        },
    })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @Roles(Role.ADMINISTRADOR)
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
