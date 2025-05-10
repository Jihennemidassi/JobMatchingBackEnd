
    import { ApiProperty } from '@nestjs/swagger';
import { Experience } from 'src/experience/entities/experience.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { User } from 'src/user/entities/user.entity';
//import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn,OneToMany,OneToOne, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
    @Entity("Candidat")
    export class Candidat{
        
       @ApiProperty()
        @PrimaryGeneratedColumn()
        id: number;

        @Column('text',{name:"skill",nullable:true,})
        skill:any;

        @Column('text',{name:"experience",nullable:true,})
        experience:any

        @OneToOne(() => User, user => user.candidat)
        @JoinColumn({ name: "idUser" })
        user: User;

       @OneToMany(()=>Resume,(resume:Resume)=>resume.candidat)
        resumes:Resume[]
    }