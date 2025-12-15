import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateCandidatDto {
      email:string;
      mot_de_passe:string;
      prenom:string;
      nom:string;

    }
    export class LoginCandidat{
         
        @IsEmail()
      @IsNotEmpty()
      email: string;
    
      @IsString()
      @IsNotEmpty()
      mot_de_passe: string;
    }

