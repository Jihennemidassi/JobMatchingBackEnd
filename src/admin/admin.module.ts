import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Administrator } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [AdminController],
    imports: [TypeOrmModule.forFeature([Administrator,User]), UserModule,],
    providers: [AdminService],
    exports: [AdminService], 
})
export class AdminModule {}
