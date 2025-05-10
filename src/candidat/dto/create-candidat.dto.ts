import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateCandidatDto {
      email:string;
      password:string;
      name:string;
        
    }
    export class LoginCandidat{
         
        @IsEmail()
      @IsNotEmpty()
      email: string;
    
      @IsString()
      @IsNotEmpty()
      password: string;
    }

