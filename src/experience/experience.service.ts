import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private ExperienceRepository: Repository<Experience>,
  ) {}  
  create(createExperienceDto: CreateExperienceDto) {
    let experience = this.ExperienceRepository.create(createExperienceDto);
    return this.ExperienceRepository.save(experience)
  }

  findAll() {
    return this.ExperienceRepository.findAndCount()
  }

  findOne(id: number) {
    return this.ExperienceRepository.findOne({where:{id:id}});
  }

  async update(id: number, UpdateexperienceDto: UpdateExperienceDto) {
    let experience= await this.ExperienceRepository.preload({id:+id,
      ...UpdateexperienceDto
    })
    if(!experience){
      throw new NotFoundException
    }
    return this.ExperienceRepository.save(experience)
    
      }
    
      remove(id: number) {
        return this.ExperienceRepository.delete(id);
      }
}
