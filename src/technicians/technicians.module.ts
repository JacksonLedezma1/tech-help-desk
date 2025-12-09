import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechniciansService } from './technicians.service';
import { TechniciansController } from './technicians.controller';
import { Technician } from './entities/technicians.entity/technicians.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Technician])],
  providers: [TechniciansService],
  controllers: [TechniciansController],
  exports: [TechniciansService],
})
export class TechniciansModule { }

