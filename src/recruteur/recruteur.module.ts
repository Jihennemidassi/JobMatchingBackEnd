import { Module } from '@nestjs/common';
import { RecruteurService } from './recruteur.service';
import { RecruteurController } from './recruteur.controller';

//import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruteur } from './entities/recruteur.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [RecruteurController],
  providers: [RecruteurService],
  imports:[TypeOrmModule.forFeature([Recruteur,User]),UserModule],
  exports:[RecruteurService]
})
export class RecruteurModule{}
