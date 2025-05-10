
import { ApiProperty } from '@nestjs/swagger';
import { Poste } from 'src/poste/entities/poste.entity';
import { User } from 'src/user/entities/user.entity';
//import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn,OneToMany,OneToOne, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
    @Entity("Recruteur")
    export class Recruteur {
      @ApiProperty()
        @PrimaryGeneratedColumn()
        id: number;

        @Column('text',{name:"entreprise",nullable:true,})
        entreprise:string

        @OneToMany(()=>Poste,(poste:Poste)=>poste.recruteur)
        postes:Poste[]

        @OneToOne(() => User, user => user.recruteur)
        @JoinColumn({ name: "idUser" })
        user: User;
    }

