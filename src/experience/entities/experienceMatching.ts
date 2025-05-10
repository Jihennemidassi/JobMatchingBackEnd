
    import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Resume } from 'src/resume/entities/resume.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';
import { Experience } from './experience.entity';
    @Entity("ExperienceMatching")
    export class ExperienceMatching{
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('integer',{name:"years",nullable:true})
        years:number;
       @ManyToOne(() => Poste, (poste) => poste.experienceMatching)
        @JoinColumn({ name: 'idPoste' })
        idPoste:Number;
        @ManyToOne(() => Resume, (resume) => resume.experienceMatching)
        @JoinColumn({ name: 'idResume' })
        idResume:Number 
        @ManyToOne(() => Experience, (experience) => experience.experienceMatching)
        @JoinColumn({ name: 'idExperience' })
        idExperience: number;
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

