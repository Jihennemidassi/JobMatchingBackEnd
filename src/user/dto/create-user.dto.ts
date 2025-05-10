import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @ApiProperty({ enum: UserRole })
    @IsNotEmpty()
    @IsEnum(UserRole)
    role: UserRole;
}
export class LoginUser{

  
    @ApiProperty()
    email: string;
  
    @ApiProperty()
    password: string;
  

}
