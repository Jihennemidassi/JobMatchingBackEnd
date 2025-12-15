import { Entity, Column, PrimaryGeneratedColumn,OneToMany,OneToOne, Admin, BeforeInsert } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Recruteur } from 'src/recruteur/entities/recruteur.entity';
import { Candidat } from 'src/candidat/entities/candidat.entity';
import { Administrator } from 'src/admin/entities/admin.entity';
import * as crypto from 'crypto';
export enum UserRole {
    CANDIDAT = 'candidat',
    RECRUTEUR = 'recruteur',
    ADMIN = 'admin',
  }

@Entity("User")
export class User {
 @PrimaryGeneratedColumn()
  id: number;

  @Column('text',{name:"nom",nullable:true,})
  nom:string;

  @Column('text',{name:"prenom",nullable:true,})
  prenom:string

  @Column('text',{name:"email",nullable:true})
  email:string

  @Column('text',{name:"mot_de_passe",nullable:true})
  mot_de_passe: string;

  @ApiProperty()
  @Column('text',{name:"token",nullable:true})
  token:string

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CANDIDAT })
  role: UserRole;

  @OneToOne(() => Administrator, admin => admin.user, { cascade: true }) // Add cascade
admin?: Administrator;

@OneToOne(() => Recruteur, recruteur => recruteur.user, { cascade: true })
recruteur?: Recruteur;

@OneToOne(() => Candidat, candidat => candidat.user, { cascade: true })
candidat?: Candidat;
@BeforeInsert()
  async generateToken() {
    this.token = this.generateRandomToken();
  }

  private generateRandomToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

