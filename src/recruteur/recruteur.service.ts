import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecruteurDto } from './dto/create-recruteur.dto';
import { UpdateRecruteurDto } from './dto/update-recruteur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruteur } from './entities/recruteur.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/user/entities/user.entity';
const bcrypt=require('bcrypt')
@Injectable()
export class RecruteurService {
constructor(
    @InjectRepository(Recruteur)
    private RecruteurRepository: Repository<Recruteur>,
     private readonly userService: UserService,
  ) {}
  async create(CreateRecruteurDto: CreateRecruteurDto) {
      // First create the User
      const user = await this.userService.createUser({
        name: CreateRecruteurDto.name,
        email: CreateRecruteurDto.email,
        password: CreateRecruteurDto.password,
        role: UserRole.RECRUTEUR// Assuming you have this enum
    });
      // Then create the Admin linked to the User
      const recruteur = new Recruteur();
      recruteur.user = user; // Link the entities
  
      return this.RecruteurRepository.save(recruteur);
    }
    

  findAll() {
    return this.RecruteurRepository.findAndCount({relations:["postes","user"]});
  }

  findOne(id: number) {
    return this.RecruteurRepository.findOne({where:{id:id},relations:["postes","user"]})
  }

  async update(id: number, updateRecruteurDto: UpdateRecruteurDto) {
    const user= await this.RecruteurRepository.preload({
      id:+id,
      ...updateRecruteurDto
    })
    if(!user){
      throw new NotFoundException
    }
    return this.RecruteurRepository.save(user)
      }
    
      remove(id: number) {
        return this.RecruteurRepository.delete(id)
      }
}
