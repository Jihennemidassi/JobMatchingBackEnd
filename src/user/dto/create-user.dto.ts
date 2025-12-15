import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
export class CreateUserDto {
    @ApiProperty({  })
    @IsOptional()
    @IsString()
    nom: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    prenom: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    mot_de_passe: string;

     @IsOptional()
  @ValidateIf(o => o.role === 'recruteur')
  @IsNotEmpty({ message: 'Entreprise is required for recruiters' })
  entreprise?: string;
  
    @ApiProperty({ enum: UserRole })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;

    
}
export class LoginUser{

  
    @ApiProperty()
    email: string;
  
    @ApiProperty()
    mot_de_passe: string;
  

}
