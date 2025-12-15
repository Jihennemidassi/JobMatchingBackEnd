import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Administrator } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Poste } from 'src/poste/entities/poste.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';

@Module({
  controllers: [AdminController],
    imports: [TypeOrmModule.forFeature([Administrator,User, Poste, Candidat, Recruteur]), UserModule,],
    providers: [AdminService],
    exports: [AdminService], 
})
export class AdminModule {}
