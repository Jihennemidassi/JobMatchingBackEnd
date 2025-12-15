
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
        idPoste: number;
        
        @Column('text',{name:"titrePoste",nullable:true,})// nom de column dans le base de donnée 
        titrePoste:string;
        
        @Column('text',{name:"descriptionPoste",nullable:true,})
        descriptionPoste:string
        
        @ManyToOne(()=>Recruteur,(recruteur:Recruteur)=>recruteur.idPoste)
        recruteur:Recruteur

       @OneToMany(() => SkillMatching, (idSkill: SkillMatching) => idSkill.idPoste, {cascade: true,onDelete:'CASCADE'})
         skillMatching: SkillMatching[];

         @OneToMany(() => ExperienceMatching, (experience: ExperienceMatching) => experience.idPoste,  {cascade: true,onDelete:'CASCADE'})
         experienceMatching: ExperienceMatching[];

        @OneToMany(()=>Education,(idEducation:Education)=>idEducation.idPoste)
        idEducation:Education[]
        
        @ManyToMany(() => Resume, (idCV) => idCV.poste)
        @JoinTable({ name: 'poste_resume'  }) // Use your existing jointable name
        resume: Resume[];
      
        
    }

