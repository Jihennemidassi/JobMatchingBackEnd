import { Module } from '@nestjs/common';
import { PosteService } from './poste.service';
import { PosteController } from './poste.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poste } from './entities/poste.entity';
import { SkillsModule } from 'src/skills/skills.module';
import { Experience } from 'src/experience/entities/experience.entity';
import { ExperienceModule } from 'src/experience/experience.module';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { RecruteurModule } from 'src/recruteur/recruteur.module';
import { CandidatModule } from 'src/candidat/candidat.module';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Module({
  controllers: [PosteController],
  providers: [PosteService],
  imports:[TypeOrmModule.forFeature([Poste , SkillMatching, ExperienceMatching, Candidat]),RecruteurModule,SkillsModule,ExperienceModule]
})
export class PosteModule {}
