import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    FindOptionsWhere,
    ObjectLiteral,
    QueryDeepPartialEntity,
    Repository,
} from 'typeorm';

import { AppModule } from './app.module';
import { Category } from './categories/entities/categories.entity/categories.entity';
import { Client } from './clients/entities/clients.entity/clients.entity';
import { Technician } from './technicians/entities/technicians.entity/technicians.entity';
import { Ticket } from './tickets/entities/tickets.entity/tickets.entity';
import { TicketStatus } from './common/enums/ticket-status.enum';
import { User } from './users/entities/user.entity';
import { Role } from './common/enums/role.enum';

async function upsertOne<T extends ObjectLiteral>(
    repo: Repository<T>,
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
): Promise<T> {
    const existing = await repo.findOne({ where });
    if (existing) {
        return existing;
    }
    const entity = repo.create({ ...where, ...data } as any);
    return (await repo.save(entity as any)) as unknown as T;
}

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const categoryRepo = app.get<Repository<Category>>(getRepositoryToken(Category));
    const clientRepo = app.get<Repository<Client>>(getRepositoryToken(Client));
    const technicianRepo = app.get<Repository<Technician>>(getRepositoryToken(Technician));
    const ticketRepo = app.get<Repository<Ticket>>(getRepositoryToken(Ticket));
    const userRepo = app.get<Repository<User>>(getRepositoryToken(User));

    console.log('Seeding data...');

    // Categories
    const hardware = await upsertOne(categoryRepo, { name: 'Hardware (Seed)' }, { description: 'Hardware issues - seed data' });
    const software = await upsertOne(categoryRepo, { name: 'Software (Seed)' }, { description: 'Software issues - seed data' });

    // Users
    const adminUser = await upsertOne(userRepo, { email: 'admin@seed.com' }, {
        password: 'Admin123!',
        name: 'Admin User (Seed)',
        role: Role.ADMIN,
    });
    const techUser = await upsertOne(userRepo, { email: 'tech@seed.com' }, {
        password: 'Tech123!',
        name: 'Tech User (Seed)',
        role: Role.TECHNICIAN,
    });
    const clientUser = await upsertOne(userRepo, { email: 'client@seed.com' }, {
        password: 'Client123!',
        name: 'Client User (Seed)',
        role: Role.CLIENT,
    });

    // Clients
    const acmeClient = await upsertOne(clientRepo, { contactEmail: 'contacto@acme-seed.com' }, {
        name: 'Acme Corp (Seed)',
        company: 'Acme Corp',
    });
    const globexClient = await upsertOne(clientRepo, { contactEmail: 'it@globex-seed.com' }, {
        name: 'Globex (Seed)',
        company: 'Globex',
    });

    // Technicians
    const netTech = await upsertOne(technicianRepo, { name: 'María López (Seed)' }, {
        specialty: 'Networks',
        availability: true,
    });
    const sysTech = await upsertOne(technicianRepo, { name: 'Juan Pérez (Seed)' }, {
        specialty: 'Systems',
        availability: true,
    });

    // Tickets
    await upsertOne(ticketRepo, { title: 'Printer not responding (Seed)' }, {
        description: 'Printer shows error 50.',
        categoryId: hardware.id,
        clientId: acmeClient.id,
        technicianId: netTech.id,
        status: TicketStatus.IN_PROGRESS,
        priority: 'high',
    });

    await upsertOne(ticketRepo, { title: 'CRM Update (Seed)' }, {
        description: 'CRM does not load after last update.',
        categoryId: software.id,
        clientId: globexClient.id,
        technicianId: sysTech.id,
        status: TicketStatus.OPEN,
        priority: 'medium',
    });

    await upsertOne(ticketRepo, { title: 'Mail sync issue (Seed)' }, {
        description: 'Outlook does not sync shared folders.',
        categoryId: software.id,
        clientId: acmeClient.id,
        status: TicketStatus.OPEN,
        priority: 'high',
    });

    console.log('Seed completed.');
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
});

