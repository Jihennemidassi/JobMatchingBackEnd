
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ExperienceMatching } from './experienceMatching';

    @Entity("Experience")
    export class  Experience {
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('text',{name:"title",nullable:true,}) 
        title:string 
        @Column('text',{name:"description",nullable:true,}) 
        description:string 
        @Column('integer',{name:"years",nullable:true})
        years:number;
      @OneToMany(() => ExperienceMatching, (experienceMatching) => experienceMatching.idExperience, { cascade: true })
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

