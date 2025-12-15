import { Body, Controller, ForbiddenException, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUser } from 'src/user/dto/create-user.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { UserRole } from 'src/user/entities/user.entity';
import { RolesGuard } from './roles/roles.guard';
import { Roles } from './roles/roles.decorator';

// You'll need to create this

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sinscrire')
async signup(@Body() createUserDto: CreateUserDto) {
  return this.authService.sinscrire(createUserDto);
}

  @Post('seConnecter')
  async seConnecter(@Body() loginDto: LoginUser) {
    return this.authService.seConnecter(loginDto);
  }

  // Example endpoint for regular users
  @Get('user-profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Request() req) {
    return req.user;
  }

  // Example endpoint for admin only
  @Get('admin-profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAdminProfile(@Request() req) {
    return req.user;
  }

  // Example endpoint for recruiter
   @Get('recruteur-profile')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.RECRUTEUR)
  async getRecruiterProfile(@Request() req) {
    return req.user;
  }
}