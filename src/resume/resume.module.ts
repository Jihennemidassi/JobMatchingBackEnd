import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume } from './entities/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsModule } from 'src/skills/skills.module';
import { ExperienceModule } from 'src/experience/experience.module';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { CandidatModule } from 'src/candidat/candidat.module';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService],
  imports:[TypeOrmModule.forFeature([Resume, SkillMatching, ExperienceMatching,Candidat]),SkillsModule,ExperienceModule, CandidatModule]
})
export class ResumeModule {}
