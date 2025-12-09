import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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

@Controller('tickets')
@UseGuards(JwtGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Body() createTicketDto: CreateTicketDto) {
        return this.ticketsService.create(createTicketDto);
    }

    @Get()
    @Roles(Role.ADMINISTRADOR)
    findAll() {
        return this.ticketsService.findAll();
    }

    @Get('my-tickets')
    @Roles(Role.CLIENTE, Role.ADMINISTRADOR)
    getMyTickets(@CurrentUser() user: User) {
        return this.ticketsService.findByClient(user.id);
    }

    @Get('assigned')
    @Roles(Role.TECNICO, Role.ADMINISTRADOR)
    getAssignedTickets(@CurrentUser() user: User) {
        return this.ticketsService.findByTechnician(user.id);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
        return this.ticketsService.update(id, updateTicketDto);
    }

    @Patch(':id/status')
    @Roles(Role.TECNICO, Role.ADMINISTRADOR)
    updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
        return this.ticketsService.updateStatus(id, updateStatusDto);
    }

    @Patch(':id/assign')
    @Roles(Role.ADMINISTRADOR)
    assignTechnician(@Param('id') id: string, @Body() assignTechnicianDto: AssignTechnicianDto) {
        return this.ticketsService.assignTechnician(id, assignTechnicianDto);
    }

    @Delete(':id')
    @Roles(Role.ADMINISTRADOR)
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(id);
    }
}
