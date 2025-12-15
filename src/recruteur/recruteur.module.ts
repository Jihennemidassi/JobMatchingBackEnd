import { Module } from '@nestjs/common';
import { RecruteurService } from './recruteur.service';
import { RecruteurController } from './recruteur.controller';

//import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruteur } from './entities/recruteur.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';

@Module({
  controllers: [RecruteurController],
  providers: [RecruteurService],
  imports:[TypeOrmModule.forFeature([Recruteur,User,Candidat,Poste,Resume]),UserModule],
  exports:[RecruteurService]
})
export class RecruteurModule{}
