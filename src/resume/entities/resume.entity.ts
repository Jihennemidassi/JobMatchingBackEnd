import { Candidat } from 'src/candidat/entities/candidat.entity';
import { ExperienceMatching } from 'src/experience/entities/experienceMatching';
import { Poste } from 'src/poste/entities/poste.entity';
import { Skill } from 'src/skills/entities/skill.entity';
import { SkillMatching } from 'src/skills/entities/skillMatching';
import{BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
@Entity("resume")
export class Resume {
    @PrimaryGeneratedColumn()
    id:number
    @Column({ nullable: true })
filePath: string;

@Column({ nullable: true })
fileName: string;
    @Column('text',{name:"title" ,nullable:true})
    title:string
    @Column('text',{name:"description",nullable:true})
    description:string
   @ManyToOne(()=>Candidat,(candidat:Candidat)=>candidat.resumes)
        candidat:Candidat[]
    @OneToMany(() => SkillMatching, (skill: SkillMatching) => skill.idResume)
    skillsMatching: SkillMatching[];
    @OneToMany(() => ExperienceMatching, (experience: ExperienceMatching) => experience.idResume)
    experienceMatching: ExperienceMatching[];
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
}
