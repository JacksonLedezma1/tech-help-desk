import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AssignTechnicianDto } from './dto/assign-technician.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Ticket } from './entities/tickets.entity/tickets.entity';
import { CategoriesService } from '../categories/categories.service';
import { ClientsService } from '../clients/clients.service';
import { TechniciansService } from '../technicians/technicians.service';
import { TicketStatus } from '../common/enums/ticket-status.enum';


@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepository: Repository<Ticket>,
        private readonly categoriesService: CategoriesService,
        private readonly clientsService: ClientsService,
        private readonly techniciansService: TechniciansService,
    ) { }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        // Validación 2: Verificar que la categoría existe
        await this.categoriesService.findOne(createTicketDto.categoryId);

        // Validación 2: Verificar que el cliente existe
        await this.clientsService.findOne(createTicketDto.clientId);

        const ticket = this.ticketRepository.create(createTicketDto);
        return await this.ticketRepository.save(ticket);
    }

    async findAll(): Promise<Ticket[]> {
        return await this.ticketRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Ticket> {
        const ticket = await this.ticketRepository.findOne({ where: { id } });
        if (!ticket) {
            throw new NotFoundException(`Ticket with ID "${id}" not found`);
        }
        return ticket;
    }

    async findByClient(clientId: string): Promise<Ticket[]> {
        return await this.ticketRepository.find({
            where: { clientId },
            order: { createdAt: 'DESC' },
        });
    }

    async findByTechnician(technicianId: string): Promise<Ticket[]> {
        return await this.ticketRepository.find({
            where: { technicianId },
            order: { createdAt: 'DESC' },
        });
    }

    async update(id: string, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.findOne(id);

        // Si se está actualizando el técnico, validar la carga de trabajo
        if (updateTicketDto.technicianId && updateTicketDto.technicianId !== ticket.technicianId) {
            await this.validateTechnicianWorkload(updateTicketDto.technicianId);
        }

        // Si se está actualizando el estado, validar la transición
        if (updateTicketDto.status && updateTicketDto.status !== ticket.status) {
            this.validateStatusTransition(ticket.status, updateTicketDto.status);
        }

        Object.assign(ticket, updateTicketDto);
        return await this.ticketRepository.save(ticket);
    }

    async updateStatus(id: string, updateStatusDto: UpdateStatusDto): Promise<Ticket> {
        const ticket = await this.findOne(id);

        // Validación 4: Validar la transición de estado
        this.validateStatusTransition(ticket.status, updateStatusDto.status);

        ticket.status = updateStatusDto.status;
        return await this.ticketRepository.save(ticket);
    }

    async assignTechnician(id: string, assignTechnicianDto: AssignTechnicianDto): Promise<Ticket> {
        const ticket = await this.findOne(id);

        // Verificar que el técnico existe
        await this.techniciansService.findOne(assignTechnicianDto.technicianId);

        // Validación 3: Verificar que el técnico no tenga más de 5 tickets "en progreso"
        await this.validateTechnicianWorkload(assignTechnicianDto.technicianId);

        ticket.technicianId = assignTechnicianDto.technicianId;

        // Automáticamente cambiar el estado a "en progreso" si está asignando un técnico
        if (ticket.status === TicketStatus.OPEN) {
            ticket.status = TicketStatus.IN_PROGRESS;
        }

        return await this.ticketRepository.save(ticket);
    }

    async remove(id: string): Promise<void> {
        const ticket = await this.findOne(id);
        await this.ticketRepository.remove(ticket);
    }

    /**
     * Validación 3: Validar que el técnico no tenga más de 5 tickets "en progreso"
     */
    private async validateTechnicianWorkload(technicianId: string): Promise<void> {
        const inProgressCount = await this.countInProgressByTechnician(technicianId);

        if (inProgressCount >= 5) {
            throw new BadRequestException(
                `Technician already has the maximum of 5 tickets in progress (current: ${inProgressCount})`,
            );
        }
    }

    /**
     * Contar tickets "en progreso" de un técnico
     */
    async countInProgressByTechnician(technicianId: string): Promise<number> {
        return await this.ticketRepository.count({
            where: {
                technicianId,
                status: TicketStatus.IN_PROGRESS,
            },
        });
    }

    /**
     * Validación 4: Validar transiciones de estado del ticket
     * Secuencia válida: Abierto → En progreso → Resuelto → Cerrado
     */
    private validateStatusTransition(currentStatus: TicketStatus, newStatus: TicketStatus): void {
        // Si el estado no cambia, no hay problema
        if (currentStatus === newStatus) {
            return;
        }

        const validTransitions: Record<TicketStatus, TicketStatus[]> = {
            [TicketStatus.OPEN]: [TicketStatus.IN_PROGRESS],
            [TicketStatus.IN_PROGRESS]: [TicketStatus.RESOLVED],
            [TicketStatus.RESOLVED]: [TicketStatus.CLOSED],
            [TicketStatus.CLOSED]: [], // Cannot change from closed
        };

        const allowedNextStatuses = validTransitions[currentStatus];

        if (!allowedNextStatuses.includes(newStatus)) {
            throw new BadRequestException(
                `Invalid status transition: cannot change from "${currentStatus}" to "${newStatus}". ` +
                `Valid states from "${currentStatus}": ${allowedNextStatuses.length > 0 ? allowedNextStatuses.join(', ') : 'none (ticket closed)'}`,
            );
        }
    }
}
