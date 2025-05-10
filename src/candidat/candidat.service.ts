import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCandidatDto } from './dto/create-candidat.dto';
import { UpdateCandidatDto } from './dto/update-candidat.dto';
import { Candidat } from './entities/candidat.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/user.entity';
const bcrypt=require('bcrypt')
@Injectable()
export class CandidatService {
  constructor(
    @InjectRepository(Candidat)
    private CandidatRepository: Repository<Candidat>,
        private readonly userService: UserService,
  ) {}
  async create(createCandidatDto: CreateCandidatDto) {
    const user = await this.userService.createUser({
       name: createCandidatDto.name,
       email: createCandidatDto.email,
       password: createCandidatDto.password,
       role: UserRole.CANDIDAT// Assuming you have this enum
   });
     // Then create the Admin linked to the User
     const candidat = new Candidat();
     candidat.user = user; // Link the entities
 
     return this.CandidatRepository.save(candidat);
   }

  findAll() {
    return this.CandidatRepository.findAndCount({relations:["user"]});
  }

  findOne(id: number) {
    return this.CandidatRepository.findOne({where:{id:id},relations:["user"]});
  }

  async update(id: number, UpdateCandidatDto: UpdateCandidatDto) {
    let Candidat= await this.CandidatRepository.preload({id:+id,
      ...UpdateCandidatDto
    })
    if(!Candidat){
      throw new NotFoundException
    }
    return this.CandidatRepository.save(Candidat)
    
      }
    
      remove(id: number) {
        return this.CandidatRepository.delete(id);
      }
}
