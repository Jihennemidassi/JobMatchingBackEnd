import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from 'src/user/entities/user.entity';
export class CreateAdminDto {
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