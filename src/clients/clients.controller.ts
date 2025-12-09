import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('clients')
@UseGuards(JwtGuard, RolesGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    @Roles(Role.ADMINISTRADOR)
    create(@Body() createClientDto: CreateClientDto) {
        return this.clientsService.create(createClientDto);
    }

    @Get()
    findAll() {
        return this.clientsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.clientsService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.ADMINISTRADOR)
    update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
        return this.clientsService.update(id, updateClientDto);
    }

    @Delete(':id')
    @Roles(Role.ADMINISTRADOR)
    remove(@Param('id') id: string) {
        return this.clientsService.remove(id);
    }
}
