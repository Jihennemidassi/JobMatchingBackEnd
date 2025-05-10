import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { SkillMatching } from './entities/skillMatching';

@Module({
  controllers: [SkillsController],
  providers: [SkillsService],
  imports:[TypeOrmModule.forFeature([Skill,SkillMatching])],
  exports:[TypeOrmModule.forFeature([Skill,SkillMatching]), SkillsService],
})
export class SkillsModule {}
