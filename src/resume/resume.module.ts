import { Module } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeController } from './resume.controller';
import { Resume } from './entities/resume.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SkillsModule } from 'src/skills/skills.module';
import { ExperienceModule } from 'src/experience/experience.module';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService],
  imports:[TypeOrmModule.forFeature([Resume]),SkillsModule,ExperienceModule]
})
export class ResumeModule {}
