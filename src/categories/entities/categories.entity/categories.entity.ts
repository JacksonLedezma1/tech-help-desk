import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../../tickets/entities/tickets.entity/tickets.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => Ticket, (ticket) => ticket.category)
    tickets: Ticket[];
}

