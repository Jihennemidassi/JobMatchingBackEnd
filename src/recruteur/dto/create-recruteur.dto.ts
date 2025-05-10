import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class CreateRecruteurDto {
    email:string;
    password:string;
    name:string;
      
  }
  export class LoginAdmin{
       
      @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    password: string;
  }
