import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { ExperienceMatching } from './entities/experienceMatching';

@Module({
 controllers: [ExperienceController],
   providers: [ExperienceService],
   imports:[TypeOrmModule.forFeature([Experience,ExperienceMatching])],
   exports:[TypeOrmModule.forFeature([Experience,ExperienceMatching]), ExperienceService],
})
export class ExperienceModule {}
