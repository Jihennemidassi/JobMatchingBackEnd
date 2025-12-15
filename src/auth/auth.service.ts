import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, LoginUser } from 'src/user/dto/create-user.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { jwtConstants } from './constants';


const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async ValidateUser(email: string, mot_de_passe: string): Promise<Partial<User>> {
        const user = await this.userService.FindByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Strip sensitive data and return
        const { mot_de_passe: _, ...safeUser } = user;
        return safeUser;
    }

   // auth.service.ts
async sinscrire(createUserDto: CreateUserDto): Promise<{ user: Partial<User>, token: string }> {
  // 1. First check if user exists
  const existingUser = await this.userService.FindByEmail(createUserDto.email);
  if (existingUser) {
    throw new ConflictException('Email already exists');
  }

  // 2. Create the user with hashed password
  const user = await this.userService.createUser({
    ...createUserDto,
    // Ensure password is hashed in createUser method
  });

  // 3. Generate JWT token
  const payload = { 
    sub: user.id, 
    email: user.email, 
    role: user.role 
  };
  const token = this.jwtService.sign(payload);

  // 4. Remove sensitive data from response
  const { mot_de_passe, ...safeUser } = user;

  return {
    user: safeUser,
    token
  };
}

    async seConnecter(loginDto: LoginUser) {
        const user = await this.userService.FindByEmail(loginDto.email);
        console.log(user);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
      
        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(loginDto.mot_de_passe, user.mot_de_passe || '');
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials');
        }
      
        // 3. Generate token with user's actual role from DB
        const payload = { 
          sub: user.id, 
          email: user.email, 
          role: user.role // Use role from user entity, not from request
        };
        
        return {
          access_token: this.jwtService.sign(payload),
          email: user.email, 
          id: user.id, 
          role: user.role
        };
      }

  

    // Optional: Role verification method for other services
    verifyUserRole(user: Partial<User>, requiredRole: UserRole): boolean {
        return user.role === requiredRole;
    }
}