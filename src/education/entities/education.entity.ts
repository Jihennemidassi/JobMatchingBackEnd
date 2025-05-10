import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Poste } from 'src/poste/entities/poste.entity';
import { Entity, Column, PrimaryGeneratedColumn,ManyToMany,JoinTable, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
    @Entity("Education")
    export class  Education {
        
        @PrimaryGeneratedColumn()
        id: number;
        @Column('text',{name:"idPoste",nullable:true,})
        idPoste:string;
        @Column('text',{name:"idResume",nullable:true})
        idResume:string 
        @Column('text',{name:"description",nullable:true,}) 
        description:string
        @Column('text',{name:"title",nullable:true,}) 
        title:string 
        // @ManyToMany(()=>Candidat,(candidat:Candidat)=>candidat.skills)
        // @JoinTable()
        // candidats:Candidat[]
        @ManyToOne(()=>Poste,(poste:Poste)=>poste.education)
        @JoinTable()
        posteId:number
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