import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository } from 'typeorm';
import { CreateAdminDto, LoginAdmin } from './dto/create-admin.dto';
import { Administrator} from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Poste } from 'src/poste/entities/poste.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
const bcrypt=require('bcrypt')

@Injectable()
export class AdminService {
 
  constructor(
    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
    private readonly userService: UserService,
   @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Poste)
    private posteRepository: Repository<Poste>,
   @InjectRepository(Recruteur)
    private recruteurRepository: Repository<Recruteur>,
    @InjectRepository(Candidat)
    private candidatRepository: Repository<Candidat>,) {}
    


  async create(createAdminDto: CreateAdminDto) {
    // First create the User
    const user = await this.userService.createUser({
      prenom: createAdminDto.prenom,
      nom: createAdminDto.nom,
      email: createAdminDto.email,
      mot_de_passe: createAdminDto.mot_de_passe,
      // entreprise:undefined,
      role: UserRole.ADMIN// Assuming you have this enum
  });
    // Then create the Admin linked to the User
    const admin = new Administrator();
    admin.user = user; // Link the entities

    return this.adminRepository.save(admin);
  }
  async login(loginAdmin: LoginAdmin) {
    // Delegate to UserService for authentication
    const user = await this.userService.login({
      email: loginAdmin.email,
      mot_de_passe: loginAdmin.mot_de_passe,
    });
    if (user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Invalid credentials for admin');
    }

    // Return the admin profile with user data
    return this.adminRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user']
    });
  }
  generateAlphabeticToken(length: number): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&$';
    let token = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        token += alphabet[randomIndex];
    }
    return token;
}
async  hashPassword(password: string){
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log('password',password,hashedPassword.toString())
    return await hashedPassword.toString();

 
}

  async findAll() {
    return this.adminRepository.findAndCount({relations:["user"]});
  }
  


  findOne(id: number) {
   return this.adminRepository.findOne({where:{id:id}})
  }



  async update(id: number, updateAdminDto: UpdateAdminDto) {
const Admin= await this.adminRepository.preload({
  id:+id,
  ...updateAdminDto
})
if(!Admin){
  throw new NotFoundException
}
return this.adminRepository.save(Admin)
  }

  remove(id: number) {
    return this.adminRepository.delete(id)
  }
  FindByEmail(email: string) {
    return this.adminRepository.findOne({
      where: { user: { email } },
      relations: ['user']
    });
  }

  async getDashboardStats() {
   const [totalUsers, totalJobs, recruiters, candidates] = await Promise.all([
    this.userRepository.count(),
    this.posteRepository.count(),
    this.recruteurRepository.createQueryBuilder("recruteur")
      .innerJoin("recruteur.user", "user")
      .where("user.role = :role", { role: 'recruteur' })
      .getCount(),
    this.candidatRepository.createQueryBuilder("candidat")
      .innerJoin("candidat.user", "user")
      .where("user.role = :role", { role: 'candidat' })
      .getCount()
  ]);

  return {
    totalUsers,
    totalJobs,
    totalRecruiters: recruiters,
    totalCandidates: candidates,
    // Verify the counts match your expectations
    verification: {
      allUsers: await this.userRepository.count(),
      usersWithRecruteurRole: await this.userRepository.count({ where: { role:UserRole.RECRUTEUR } }),
      usersWithCandidatRole: await this.userRepository.count({ where: { role:UserRole.CANDIDAT } })
    }
  };
}
}
