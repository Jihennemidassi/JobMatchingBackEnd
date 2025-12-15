import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateRecruteurDto {
    email:string;
    mot_de_passe:string;
    prenom:string;
    entreprise:string;
    nom:string;

  }
  export class LoginRecruteur{
       
      @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    mot_de_passe: string;
  }
