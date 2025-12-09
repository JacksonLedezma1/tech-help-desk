import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Categories')
@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Create a new category' })
    @ApiBody({
        type: CreateCategoryDto,
        examples: {
            default: {
                summary: 'Category payload',
                value: {
                    name: 'Hardware',
                    description: 'Incidencias relacionadas con equipos físicos',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Category successfully created.',
        schema: {
            example: {
                success: true,
                data: {
                    id: '6c7d8e9f-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
                    name: 'Hardware',
                    description: 'Incidencias relacionadas con equipos físicos',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMINISTRADOR role.' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all categories' })
    @ApiResponse({
        status: 200,
        description: 'Return all categories.',
        schema: {
            example: {
                success: true,
                data: [
                    {
                        id: '6c7d8e9f-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
                        name: 'Hardware',
                        description: 'Incidencias relacionadas con equipos físicos',
                    },
                ],
                message: 'Request successful',
            },
        },
    })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a category by ID' })
    @ApiResponse({
        status: 200,
        description: 'Return the category.',
        schema: {
            example: {
                success: true,
                data: {
                    id: '6c7d8e9f-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
                    name: 'Hardware',
                    description: 'Incidencias relacionadas con equipos físicos',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Update a category' })
    @ApiBody({
        type: UpdateCategoryDto,
        examples: {
            default: {
                summary: 'Update payload',
                value: {
                    description: 'Incidencias de impresoras y equipos físicos',
                },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Category successfully updated.',
        schema: {
            example: {
                success: true,
                data: {
                    id: '6c7d8e9f-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
                    name: 'Hardware',
                    description: 'Incidencias de impresoras y equipos físicos',
                },
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMINISTRADOR role.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @Roles(Role.ADMINISTRADOR)
    @ApiOperation({ summary: 'Delete a category' })
    @ApiResponse({
        status: 200,
        description: 'Category successfully deleted.',
        schema: {
            example: {
                success: true,
                data: null,
                message: 'Request successful',
            },
        },
    })
    @ApiResponse({ status: 403, description: 'Forbidden. Requires ADMINISTRADOR role.' })
    @ApiResponse({ status: 404, description: 'Category not found.' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
