
    import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn, OneToMany } from 'typeorm';
import { Skill } from './skill.entity';
    @Entity("SkillMatching")
    export class SkillMatching{
        
        @PrimaryGeneratedColumn()
        id: number;
       @ManyToOne(() => Poste, (poste) => poste.skillsMatching)
        @JoinColumn({ name: 'idPoste' })
        idPoste:Number;
        @ManyToOne(() => Resume, (resume) => resume.skillsMatching)
        @JoinColumn({ name: 'idResume' })
        idResume:Number 
        @ManyToOne(() => Skill, (skill) => skill.skillMatching)
        @JoinColumn({ name: 'idSkill' })
        idSkill: any;

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

