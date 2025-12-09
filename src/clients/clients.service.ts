import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/clients.entity/clients.entity';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) { }

    async create(createClientDto: CreateClientDto): Promise<Client> {
        try {
            const client = this.clientRepository.create(createClientDto);
            return await this.clientRepository.save(client);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('El correo de contacto ya está registrado');
            }
            throw error;
        }
    }

    async findAll(): Promise<Client[]> {
        return await this.clientRepository.find({
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException(`Cliente con ID "${id}" no encontrado`);
        }
        return client;
    }

    async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
        const client = await this.findOne(id);
        Object.assign(client, updateClientDto);
        return await this.clientRepository.save(client);
    }

    async remove(id: string): Promise<void> {
        const client = await this.findOne(id);
        await this.clientRepository.remove(client);
    }
}
