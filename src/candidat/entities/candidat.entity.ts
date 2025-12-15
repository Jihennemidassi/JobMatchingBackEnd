
 import { ApiProperty } from '@nestjs/swagger';
import { Resume } from 'src/resume/entities/resume.entity';
import { User } from 'src/user/entities/user.entity';
//import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn,OneToMany,OneToOne, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
    @Entity("Candidat")
    export class Candidat{
        
       @ApiProperty()
        @PrimaryGeneratedColumn()
        id: number;


        @OneToOne(() => User, user => user.candidat)
        @JoinColumn({ name: "idUser" })
        user: User;

       @OneToMany(()=>Resume,(idCV:Resume)=>idCV.candidat)
        idCV:Resume[]
    }