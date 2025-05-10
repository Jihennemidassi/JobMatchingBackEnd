
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { SkillMatching } from './skillMatching';
    @Entity("Skill")
    export class  Skill {
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('text',{name:"title",nullable:true,}) 
        title:string 
        @Column('text',{name:"description",nullable:true,}) 
        description:string 
      @OneToMany(() => SkillMatching, (skillMatching) => skillMatching.idSkill, { cascade: true })
         skillMatching: SkillMatching[];
       
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

