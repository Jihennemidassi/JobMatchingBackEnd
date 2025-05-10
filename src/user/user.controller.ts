import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUser } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LocalAuthGuard } from 'src/auth/local-passport/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User, UserRole } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Administrator } from '../admin/entities/admin.entity';
import { Recruteur } from '../recruteur/entities/recruteur.entity';
import { Candidat } from '../candidat/entities/candidat.entity';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
    @Post('create-user')
    create(@Body() createUserDto: CreateUserDto) {
      return this.userService.createUser(createUserDto);
    }
  @UseGuards(LocalAuthGuard)

  @Post('login-user')
  async userLogin(@Body() loginUser: LoginUser) {
    try {
      const user = await this.userService.login(loginUser);
      return {
        success: true,
        user,
        message: 'Login successful'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Login failed',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
 // @Post('signup-user')
 // userSignup(@Body() signupUser: SignupUser) {
   // return this.userService.login(signupUser);}

  @UseGuards( JwtAuthGuard)
  @ApiBearerAuth()
  @Get('liste-user')
  findAll() {
    return this.userService.findAll();
  }
  @Get('user-list-query')
  FindUserByQuery(@Query('filter')filter:string){
    return this.userService;
  }

  @Get('user/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('update-user/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete-user/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  @Get('get-email-user/:email')
  getByEmail(@Param('email') email: string){
    return this.userService.FindByEmail(email)
  }

}
