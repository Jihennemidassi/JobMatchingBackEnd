import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Administrator } from 'src/admin/entities/admin.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';

@Module({
  controllers: [UserController],
  imports: [ TypeOrmModule.forFeature([User, Administrator, Recruteur, Candidat]),],
  providers: [UserService],
  exports: [UserService], 
})
export class UserModule {}
