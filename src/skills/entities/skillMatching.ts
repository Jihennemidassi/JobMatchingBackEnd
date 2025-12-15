
    import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn, OneToMany } from 'typeorm';
import { Skill } from './skill.entity';
    @Entity("SkillMatching")
    export class SkillMatching{
        
        @PrimaryGeneratedColumn()
        id: number;
       @ManyToOne(() => Poste, (poste) => poste.skillMatching)
        @JoinColumn({ name: 'idPoste' })
        idPoste:Number;
        @ManyToOne(() => Resume, (idCV) => idCV.skillMatching)
        @JoinColumn({ name: 'idCV' })
        idCV:Number 
        @ManyToOne(() => Skill, (idSkill) => idSkill.skillMatching)
        @JoinColumn({ name: 'idSkill' })
        idSkill: any;
       
     }
     

