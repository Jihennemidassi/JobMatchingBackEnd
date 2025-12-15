import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRecruteurDto } from './dto/create-recruteur.dto';
import { UpdateRecruteurDto } from './dto/update-recruteur.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recruteur } from './entities/recruteur.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User, UserRole } from 'src/user/entities/user.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Resume } from 'src/resume/entities/resume.entity';

@Injectable()
export class RecruteurService {
  constructor(
    @InjectRepository(Recruteur)
    private recruteurRepository: Repository<Recruteur>,
    private readonly userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Poste)
    private posteRepository: Repository<Poste>,
    @InjectRepository(Resume)
    private resumeRepository: Repository<Resume>,
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,
  ) {}

  async create(createRecruteurDto: CreateRecruteurDto) {

    const existingUser = await this.userService.FindByEmail(createRecruteurDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }


    const user = await this.userService.createUser({
      prenom:createRecruteurDto.prenom,
      email:createRecruteurDto.email,
      mot_de_passe:createRecruteurDto.mot_de_passe,
      nom: createRecruteurDto.nom,
      role: UserRole.RECRUTEUR
    });

    const recruteur = new Recruteur();
    recruteur.user = user;
    recruteur.entreprise = createRecruteurDto.entreprise;

    return this.recruteurRepository.save(recruteur);
  }

  findAll() {
    return this.recruteurRepository.findAndCount({ relations: ["idPoste", "user"] });
  }

  findOne(id: number) {
    return this.recruteurRepository.findOne({ 
      where: { id },
      relations: ["idPoste", "user"] 
    });
  }

  async update(id: number, updateRecruteurDto: UpdateRecruteurDto) {
    const recruteur = await this.recruteurRepository.preload({
      id: +id,
      ...updateRecruteurDto
    });

    if (!recruteur) {
      throw new NotFoundException(`Recruteur with ID ${id} not found`);
    }


    if (updateRecruteurDto.email && recruteur.user.email !== updateRecruteurDto.email) {
      const existingUser = await this.userService.FindByEmail(updateRecruteurDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

   
    if (recruteur.user && updateRecruteurDto) {
      Object.assign(recruteur.user, {
        prenom: updateRecruteurDto.prenom,
        email: updateRecruteurDto.email,
        entreprise: updateRecruteurDto.entreprise,
        nom: updateRecruteurDto.nom
      });

      if (updateRecruteurDto.mot_de_passe) {
        recruteur.user.mot_de_passe = await this.userService.hashPassword(updateRecruteurDto.mot_de_passe);
      }
    }

    return this.recruteurRepository.save(recruteur);
  }

  async remove(id: number) {
    const recruteur = await this.findOne(id);
    if (!recruteur) {
      throw new NotFoundException(`Recruteur with ID ${id} not found`);
    }
    return this.recruteurRepository.remove(recruteur);
  }

  async getDashboardStats() {
     const [totalJobs,totalResumes,candidates] = await Promise.all([
      this.posteRepository.count(),
      this.resumeRepository.count(),
      this.candidatRepository.createQueryBuilder("candidat")
        .innerJoin("candidat.user", "user")
        .where("user.role = :role", { role: 'candidat' })
        .getCount()
    ]);
  
    return {
      totalJobs,
      totalResumes,
      totalCandidates: candidates,

      verification: {
        allUsers: await this.userRepository.count(),
        usersWithCandidatRole: await this.userRepository.count({ where: { role:UserRole.CANDIDAT } })
      }
    };
  }
  findPosteByCandidat(userId: number) {
  return this.posteRepository.findOne({
     where: { 
      recruteur: { 
        user: { id: userId } 
      } 
    },
    relations: ['recruteur', 'recruteur.user'] 
  });
  }
}