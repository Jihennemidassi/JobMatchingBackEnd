import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt/jwt.strategy';
import { LocalStrategy } from './local-passport/local.strategy';

@Module({
  imports: [UserModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '600000s' },
  }),PassportModule] ,// Ensure that User2Module is imported
  providers: [AuthService,JwtStrategy, LocalStrategy],
  controllers: [AuthController],

})
export class AuthModule {}
