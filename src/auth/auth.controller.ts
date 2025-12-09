import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './jwt/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({
        type: RegisterDto,
        examples: {
            cliente: {
                summary: 'Register payload (cliente)',
                value: {
                    email: 'client@example.com',
                    password: 'password123',
                    name: 'Client User',
                    role: 'cliente',
                    company: 'Acme Corp',
                },
            },
            admin: {
                summary: 'Register payload (administrador)',
                value: {
                    email: 'admin@example.com',
                    password: 'password123',
                    name: 'Admin User',
                    role: 'administrador',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully registered.',
        schema: {
            example: {
                success: true,
                data: {
                    email: 'admin@example.com',
                    name: 'John Doe',
                    role: 'administrador',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 409, description: 'Email already exists.' })
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({
        type: LoginDto,
        examples: {
            default: {
                summary: 'Login payload',
                value: {
                    email: 'admin@example.com',
                    password: 'password123',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'User successfully logged in.',
        schema: {
            example: {
                success: true,
                data: {
                    access_token: 'jwt.token.here',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials.' })
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(JwtGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Return current user profile.',
        schema: {
            example: {
                success: true,
                data: {
                    email: 'user@example.com',
                    name: 'John Doe',
                    role: 'administrador',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    getProfile(@CurrentUser() user: User) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }
}
