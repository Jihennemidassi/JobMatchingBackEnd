
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ExperienceMatching } from './experienceMatching';

    @Entity("Experience")
    export class  Experience {
        
        @PrimaryGeneratedColumn()
        idExperience: number;

        @Column('integer',{name:"nbExperience",nullable:true})
        nbExperience:number;
        
      @OneToMany(() => ExperienceMatching, (experienceMatching) => experienceMatching.idExperience, { cascade: true })
         experienceMatching: ExperienceMatching[];
       
     }

