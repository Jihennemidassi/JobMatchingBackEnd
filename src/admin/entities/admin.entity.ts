
    import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn,OneToMany,OneToOne, ManyToMany, JoinColumn, ManyToOne } from 'typeorm';
    @Entity("Administrator")
    export class Administrator  {
            @ApiProperty()
            @PrimaryGeneratedColumn()
            id: number;
            
            @OneToOne(() => User, user => user.admin) // Reference the 'admin' field in User
             @JoinColumn({ name: "idUser" })
             user: User;

    }