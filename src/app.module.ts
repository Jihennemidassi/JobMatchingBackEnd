import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PosteModule } from './poste/poste.module';
import { CandidatModule } from './candidat/candidat.module';
import { SkillsModule } from './skills/skills.module';
import { ExperienceModule } from './experience/experience.module';
import { RecruteurModule } from './recruteur/recruteur.module';
import { EducationModule } from './education/education.module';
import { ResumeModule } from './resume/resume.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "postgres",
        database: "resume-job",
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    ConfigModule.forRoot(),
    PosteModule,
    CandidatModule,
    SkillsModule,
    ExperienceModule,
    RecruteurModule,
    EducationModule,
    ResumeModule,
    AdminModule,
    UserModule,
    AuthModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
