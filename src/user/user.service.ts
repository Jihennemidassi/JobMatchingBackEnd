import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Administrator } from 'src/admin/entities/admin.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Administrator)
    private readonly adminRepository: Repository<Administrator>,
    @InjectRepository(Recruteur)
    private readonly recruteurRepository: Repository<Recruteur>,
    @InjectRepository(Candidat)
    private readonly candidatRepository: Repository<Candidat>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = new User();
    user.prenom = createUserDto.prenom;
     user.token = this.generateAlphabeticToken(50);
    user.nom = createUserDto.nom;
    user.email = createUserDto.email;
    user.mot_de_passe = (await (this.hashPassword(createUserDto.mot_de_passe))).toString();
    user.role = createUserDto.role; 

   
    switch(createUserDto.role) {
    case UserRole.ADMIN:
      user.admin = new Administrator();
      break;
    case UserRole.RECRUTEUR:
      user.recruteur = new Recruteur();
      // Set entreprise on the Recruteur entity, not User
      if (createUserDto.entreprise) {
        user.recruteur.entreprise = createUserDto.entreprise;
      }
      break;
    case UserRole.CANDIDAT:
      user.candidat = new Candidat();
      break;
  }

  
    return this.userRepository.save(user); // Automatically saves the role too
  }

  async login(loginUser: LoginUser) {
    const user = await this.userRepository.findOne({ 
      where: { email: loginUser.email } 
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(
      loginUser.mot_de_passe,
      user.mot_de_passe
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate new token (optional)
    user.token = this.generateAlphabeticToken(50);
    await this.userRepository.save(user);

    // 4. Return user data without password
    const { mot_de_passe, ...result } = user;
    return result;
  }

  generateAlphabeticToken(length: number): string {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@&$';
    return Array.from({ length }, () => 
      alphabet[Math.floor(Math.random() * alphabet.length)]
    ).join('');
  }

  async hashPassword(mot_de_passe: string): Promise<string> {
    const saltRounds = 10;
    return  await (bcrypt.hash(mot_de_passe, saltRounds))
  }

  async findAll() {
    return this.userRepository.findAndCount();
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ["candidat", "admin", "recruteur"]
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: +id,
      ...updateUserDto
    });
    
    if (!user) {
      throw new NotFoundException();
    }
    
    return this.userRepository.save(user);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }

  FindByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
}