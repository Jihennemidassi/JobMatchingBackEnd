import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Repository } from 'typeorm';
import { CreateAdminDto, LoginAdmin } from './dto/create-admin.dto';
import { Administrator} from './entities/admin.entity';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
const bcrypt=require('bcrypt')

@Injectable()
export class AdminService {
 
  constructor(
    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
    private readonly userService: UserService,
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    // First create the User
    const user = await this.userService.createUser({
      name: createAdminDto.name,
      email: createAdminDto.email,
      password: createAdminDto.password,
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
      password: loginAdmin.password,
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
}
