
    import { Education } from 'src/education/entities/education.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, BeforeUpdate, BeforeInsert, OneToMany } from 'typeorm';
    @Entity("Poste")// nom table en base de donnée 
    export class Poste {
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('text',{name:"poste",nullable:true,})// nom de column dans le base de donnée 
        post:string;
        
        @Column('text',{name:"description",nullable:true,})
        description:string
        @Column('date',{name:"createAt",nullable:true})
        createAt:Date;
        @Column('date',{name:"update",nullable:true})
        updateAt:Date;
        @Column('integer',{name:"createby",nullable:true})
        createBy:number;
        @Column('integer',{name:"updateBy",nullable:true})
        updatedBy: number;
        @Column('boolean',{name:"active",nullable:true})
        isActive:boolean
        @BeforeInsert()
        CreateATDate(): void{
           this.createAt=new Date()
        }
        @BeforeUpdate()
        updateATDate() :void{
                this.updateAt= new Date()
        }
        
        @Column('text',{name:"nbexperience",nullable:true})
        nbexperience:string
        @ManyToOne(()=>Recruteur,(recruteur:Recruteur)=>recruteur.postes)
        recruteur:Recruteur[]
       @OneToMany(() => SkillMatching, (skill: SkillMatching) => skill.idPoste)
         skillsMatching: SkillMatching[];
         @OneToMany(() => ExperienceMatching, (experience: ExperienceMatching) => experience.idPoste)
         experienceMatching: ExperienceMatching[];
        @ManyToMany(()=>Education,(education:Education)=>education.posteId)
        education:Education[]
      
        
    }

