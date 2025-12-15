
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { SkillMatching } from './skillMatching';
    @Entity("Skill")
    export class  Skill {
        
        @PrimaryGeneratedColumn()
        idSkill: number;

        @Column('text',{name:"titreSkill",nullable:true,}) 
        titreSkill:string 
    
      @OneToMany(() => SkillMatching, (skillMatching) => skillMatching.idSkill, { cascade: true })
         skillMatching: SkillMatching[];
       
        
     }

