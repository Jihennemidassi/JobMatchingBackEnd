import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateAdminDto {
  email:string;
  mot_de_passe:string;
  prenom:string;
    nom:string;

}
export class LoginAdmin{
     
    @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  mot_de_passe: string;
}