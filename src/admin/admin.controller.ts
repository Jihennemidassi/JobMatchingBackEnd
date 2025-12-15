import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { LocalAuthGuard } from 'src/auth/local-passport/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { CreateAdminDto, LoginAdmin } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getDashboardStats();
  }
  @Post('create-admin')
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @UseGuards(LocalAuthGuard)

  @Post('login-admin')
  adminLogin(@Body() loginAdmin: LoginAdmin) {
    return this.adminService.login(loginAdmin);
  }
 // @Post('signup-admin')
 // adminSignup(@Body() signupadmin: Signupadmin) {
   // return this.adminService.login(signupadmin);}

  @UseGuards( JwtAuthGuard)
  @ApiBearerAuth()
  @Get('liste-admin/')
  findAll() {
    return this.adminService.findAll();
  }
 

  @Get('admin/:id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch('update-admin/:id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete('delete-admin/:id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
  @Get('get-email-admin/:email')
  getByEmail(@Param('email') email: string){
    return this.adminService.FindByEmail(email)
  }

}
