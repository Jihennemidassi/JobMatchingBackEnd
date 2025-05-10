import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
@Injectable()
export class SkillsService {
  constructor (
    @InjectRepository(Skill)
     private skillRepository: Repository<Skill>,){}
  create(createSkillDto: CreateSkillDto) {
    let skill = this.skillRepository.create(createSkillDto);
    return this.skillRepository.save(skill)
  }

  findAll() {
    return this.skillRepository.findAndCount();
  }

  findOne(id: number) {
    return this.skillRepository.findOne({where:{id:id}});
  }

  async update(id: number, UpdateSkillDto: UpdateSkillDto) {
    let formation= await this.skillRepository.preload({id:+id,
      ...UpdateSkillDto
    })
    if(!formation){
      throw new NotFoundException
    }
    return this.skillRepository.save(formation)
    
      }

  remove(id: number) {
    return this.skillRepository.delete(id);
  }
  
}
