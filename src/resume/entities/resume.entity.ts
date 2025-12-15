import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Education } from 'src/education/entities/education.entity';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Poste } from 'src/poste/entities/poste.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import{BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
@Entity("resume")
export class Resume {

    @PrimaryGeneratedColumn()
    idCV:number
  
    @Column('text',{name:"titreCV" ,nullable:true})
    titreCV:string

    @Column('text',{name:"descriptionCV",nullable:true})
    descriptionCV:string

   @ManyToOne(()=>Candidat,(candidat:Candidat)=>candidat.idCV)
    candidat:Candidat
    
    @OneToMany(() => SkillMatching, (idSkill: SkillMatching) => idSkill.idCV)
    skillMatching: SkillMatching[];

    @OneToMany(() => Education, (idEducation: Education) => idEducation.idCV)
    idEducation: Education[];

    @OneToMany(() => ExperienceMatching, (idExperience: ExperienceMatching) => idExperience.idCV)
    experienceMatching: ExperienceMatching[];

    @ManyToMany(() => Poste, (idPoste) => idPoste.resume)
    poste: Poste[];
    
 
       
        @Column('boolean',{name:"active",nullable:true})
        isActive:boolean
}
