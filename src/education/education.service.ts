import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Education } from './entities/education.entity';
@Injectable()
export class EducationService {
   constructor(
     @InjectRepository(Education)
     private EducationRepository: Repository<Education>,
   ) {}  
   create(createEducationDto: CreateEducationDto) {
     let Education = this.EducationRepository.create(createEducationDto);
     return this.EducationRepository.save(Education)
   }
 
   findAll() {
     return this.EducationRepository.findAndCount()
   }
 
   findOne(id: number) {
     return this.EducationRepository.findOne({where:{idEducation:id}});
   }
 
   async update(id: number, UpdateEducationDto: UpdateEducationDto) {
     let Education= await this.EducationRepository.preload({idEducation:+id,
       ...UpdateEducationDto
     })
     if(!Education){
       throw new NotFoundException
     }
     return this.EducationRepository.save(Education)
     
       }
     
       remove(id: number) {
         return this.EducationRepository.delete(id);
       }
}
