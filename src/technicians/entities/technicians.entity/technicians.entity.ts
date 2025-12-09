import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from '../../../tickets/entities/tickets.entity/tickets.entity';

@Entity('technicians')
export class Technician {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    specialty: string;

    @Column({ default: true })
    availability: boolean;

    @OneToMany(() => Ticket, (ticket) => ticket.technician)
    tickets: Ticket[];
}
