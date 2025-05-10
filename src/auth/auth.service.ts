import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUser } from 'src/user/dto/create-user.dto';
import { User, UserRole } from 'src/user/entities/user.entity';
import { jwtConstants } from './constants';


const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async ValidateUser(email: string, password: string): Promise<Partial<User>> {
        const user = await this.userService.FindByEmail(email);
        
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Strip sensitive data and return
        const { password: _, ...safeUser } = user;
        return safeUser;
    }

    async signIn(loginDto: LoginUser) {
        const user = await this.userService.FindByEmail(loginDto.email);
        console.log(user);
        if (!user) {
          throw new UnauthorizedException('Invalid credentials');
        }
      
        // 2. Compare passwords
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
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