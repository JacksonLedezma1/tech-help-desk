import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Technician } from './entities/technicians.entity/technicians.entity';

@Injectable()
export class TechniciansService {
    constructor(
        @InjectRepository(Technician)
        private readonly technicianRepository: Repository<Technician>,
    ) { }

    async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
        const technician = this.technicianRepository.create(createTechnicianDto);
        return await this.technicianRepository.save(technician);
    }

    async findAll(): Promise<Technician[]> {
        return await this.technicianRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Technician> {
        const technician = await this.technicianRepository.findOne({ where: { id } });
        if (!technician) {
            throw new NotFoundException(`Técnico con ID "${id}" no encontrado`);
        }
        return technician;
    }

    async update(id: string, updateTechnicianDto: UpdateTechnicianDto): Promise<Technician> {
        const technician = await this.findOne(id);
        Object.assign(technician, updateTechnicianDto);
        return await this.technicianRepository.save(technician);
    }

    async remove(id: string): Promise<void> {
        const technician = await this.findOne(id);
        await this.technicianRepository.remove(technician);
    }
}
