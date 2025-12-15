
    import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';
import { Experience } from './experience.entity';
    @Entity("ExperienceMatching")
    export class ExperienceMatching{
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('integer',{name:"nbExperience",nullable:true})
        nbExperience:number;
       @ManyToOne(() => Poste, (idPoste) => idPoste.experienceMatching)
        @JoinColumn({ name: 'idPoste' })
        idPoste:Number;
        @ManyToOne(() => Resume, (idCV) => idCV.experienceMatching)
        @JoinColumn({ name: 'idCV' })
        idCV:Number 
        @ManyToOne(() => Experience, (experience) => experience.experienceMatching)
        @JoinColumn({ name: 'idExperience' })
        idExperience: number;
        
       
     }

