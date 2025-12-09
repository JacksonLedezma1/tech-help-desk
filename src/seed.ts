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
    const hardware = await upsertOne(categoryRepo, { name: 'Hardware' }, { description: 'Problemas de hardware' });
    const software = await upsertOne(categoryRepo, { name: 'Software' }, { description: 'Problemas de software' });

    // Users
    const adminUser = await upsertOne(userRepo, { email: 'admin@example.com' }, {
        password: 'Admin123!',
        name: 'Admin User',
        role: Role.ADMINISTRADOR,
    });
    const techUser = await upsertOne(userRepo, { email: 'tech@example.com' }, {
        password: 'Tech123!',
        name: 'Tech User',
        role: Role.TECNICO,
    });
    const clientUser = await upsertOne(userRepo, { email: 'client@example.com' }, {
        password: 'Client123!',
        name: 'Client User',
        role: Role.CLIENTE,
    });

    // Clients
    const acmeClient = await upsertOne(clientRepo, { contactEmail: 'contacto@acme.com' }, {
        name: 'Acme Corp',
        company: 'Acme Corp',
    });
    const globexClient = await upsertOne(clientRepo, { contactEmail: 'it@globex.com' }, {
        name: 'Globex',
        company: 'Globex',
    });

    // Technicians
    const netTech = await upsertOne(technicianRepo, { name: 'María López' }, {
        specialty: 'Redes',
        availability: true,
    });
    const sysTech = await upsertOne(technicianRepo, { name: 'Juan Pérez' }, {
        specialty: 'Sistemas',
        availability: true,
    });

    // Tickets
    await upsertOne(ticketRepo, { title: 'Impresora no responde' }, {
        description: 'La impresora muestra error 50.',
        categoryId: hardware.id,
        clientId: acmeClient.id,
        technicianId: netTech.id,
        status: TicketStatus.EN_PROGRESO,
        priority: 'alta',
    });

    await upsertOne(ticketRepo, { title: 'Actualización de CRM' }, {
        description: 'El CRM no carga después de la última actualización.',
        categoryId: software.id,
        clientId: globexClient.id,
        technicianId: sysTech.id,
        status: TicketStatus.ABIERTO,
        priority: 'media',
    });

    await upsertOne(ticketRepo, { title: 'Correo no sincroniza' }, {
        description: 'Outlook no sincroniza las carpetas compartidas.',
        categoryId: software.id,
        clientId: acmeClient.id,
        status: TicketStatus.ABIERTO,
        priority: 'alta',
    });

    console.log('Seed completed.');
    await app.close();
}

bootstrap().catch((err) => {
    console.error('Seed failed', err);
    process.exit(1);
});

