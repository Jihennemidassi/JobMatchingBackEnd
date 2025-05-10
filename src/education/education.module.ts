import { Module } from '@nestjs/common';
import { EducationService } from './education.service';
import { EducationController } from './education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';

@Module({
  controllers: [EducationController],
  providers: [EducationService],
  imports:[TypeOrmModule.forFeature([Education])]
})
export class EducationModule {}
