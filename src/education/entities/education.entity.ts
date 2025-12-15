import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
    @Entity("Education")
    export class  Education {
        
        @PrimaryGeneratedColumn()
        idEducation: number;
        @Column('text',{name:"titreEducation",nullable:true,}) 
        titreEducation:string 

        @ManyToOne(()=>Poste,(idPoste:Poste)=>idPoste.idEducation)
        idPoste:Poste

        @ManyToOne(()=>Resume,(idCV:Resume)=>idCV.idEducation)
        idCV: Resume;
        
    }