import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TicketStatus } from '../../../common/enums/ticket-status.enum';
import { Category } from '../../../categories/entities/categories.entity/categories.entity';
import { Client } from '../../../clients/entities/clients.entity/clients.entity';
import { Technician } from '../../../technicians/entities/technicians.entity/technicians.entity';

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.OPEN,
    })
    status: TicketStatus;

    @Column({ nullable: true })
    priority: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relación con categoría (requerida)
    @ManyToOne(() => Category, (category) => category.tickets, { eager: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: string;

    // Relación con cliente (requerido)
    @ManyToOne(() => Client, (client) => client.tickets, { eager: true })
    @JoinColumn({ name: 'clientId' })
    client: Client;

    @Column()
    clientId: string;

    // Relación con técnico asignado (opcional)
    @ManyToOne(() => Technician, (technician) => technician.tickets, { nullable: true, eager: true })
    @JoinColumn({ name: 'technicianId' })
    technician: Technician;

    @Column({ nullable: true })
    technicianId: string;
}

