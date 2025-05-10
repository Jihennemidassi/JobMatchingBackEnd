import { Module } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { CandidatController } from './candidat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidat } from './entities/candidat.entity';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CandidatController],
  providers: [CandidatService],
  imports:[TypeOrmModule.forFeature([Candidat,User]),UserModule],
  exports: [CandidatService],
})
export class CandidatModule {}
