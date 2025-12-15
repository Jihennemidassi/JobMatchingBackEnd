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
import { Resume } from 'src/resume/entities/resume.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
import { Skill } from 'src/skills/entities/skill.entity';

@Module({
  controllers: [PosteController],
  providers: [PosteService],
  imports:[TypeOrmModule.forFeature([Poste , SkillMatching, ExperienceMatching, Resume, Recruteur, Skill , Experience]),RecruteurModule,SkillsModule,ExperienceModule]
})
export class PosteModule {}
