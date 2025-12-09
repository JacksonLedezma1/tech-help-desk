import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../../tickets/entities/tickets.entity/tickets.entity';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    company: string;

    @Column({ unique: true })
    contactEmail: string;

    @OneToMany(() => Ticket, (ticket) => ticket.client)
    tickets: Ticket[];
}
