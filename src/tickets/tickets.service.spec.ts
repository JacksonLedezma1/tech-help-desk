import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketsService } from './tickets.service';
import { Ticket } from './entities/tickets.entity/tickets.entity';
import { CategoriesService } from '../categories/categories.service';
import { ClientsService } from '../clients/clients.service';
import { TechniciansService } from '../technicians/technicians.service';
import { TicketStatus } from '../common/enums/ticket-status.enum';
import { BadRequestException } from '@nestjs/common';

describe('TicketsService', () => {
    let service: TicketsService;
    let repository: jest.Mocked<Repository<Ticket>>;
    let categoriesService: jest.Mocked<CategoriesService>;
    let clientsService: jest.Mocked<ClientsService>;
    let techniciansService: jest.Mocked<TechniciansService>;

    beforeEach(async () => {
        repository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
        } as any;

        categoriesService = { findOne: jest.fn() } as any;
        clientsService = { findOne: jest.fn() } as any;
        techniciansService = { findOne: jest.fn() } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TicketsService,
                { provide: getRepositoryToken(Ticket), useValue: repository },
                { provide: CategoriesService, useValue: categoriesService },
                { provide: ClientsService, useValue: clientsService },
                { provide: TechniciansService, useValue: techniciansService },
            ],
        }).compile();

        service = module.get<TicketsService>(TicketsService);
    });

    it('should create a ticket validating client and category', async () => {
        categoriesService.findOne.mockResolvedValueOnce({} as any);
        clientsService.findOne.mockResolvedValueOnce({} as any);
        const dto = {
            title: 'Test ticket',
            description: 'Descripción',
            categoryId: 'cat-id',
            clientId: 'client-id',
            priority: 'alta',
        };
        const created = { ...dto, id: 'ticket-id', status: TicketStatus.ABIERTO };
        repository.create.mockReturnValueOnce(created as any);
        repository.save.mockResolvedValueOnce(created as any);

        const result = await service.create(dto as any);

        expect(categoriesService.findOne).toHaveBeenCalledWith('cat-id');
        expect(clientsService.findOne).toHaveBeenCalledWith('client-id');
        expect(repository.create).toHaveBeenCalledWith(dto);
        expect(result).toEqual(created);
    });

    it('should throw when updating status with invalid transition', async () => {
        const existingTicket: Ticket = {
            id: 'ticket-id',
            title: 'Test',
            description: 'desc',
            status: TicketStatus.RESUELTO,
            priority: 'alta',
            createdAt: new Date(),
            updatedAt: new Date(),
            categoryId: 'cat',
            clientId: 'client',
            technicianId: 'tech',
            category: {} as any,
            client: {} as any,
            technician: {} as any,
        };

        repository.findOne.mockResolvedValueOnce(existingTicket);

        await expect(
            service.updateStatus('ticket-id', { status: TicketStatus.EN_PROGRESO }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });
});
