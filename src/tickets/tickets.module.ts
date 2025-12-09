import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './entities/tickets.entity/tickets.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ClientsModule } from '../clients/clients.module';
import { TechniciansModule } from '../technicians/technicians.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    CategoriesModule,
    ClientsModule,
    TechniciansModule,
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService],
})
export class TicketsModule { }
