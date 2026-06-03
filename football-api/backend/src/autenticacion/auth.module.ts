import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey123',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {} 

/*
auth.module.ts — El paquete que agrupa todo
NestJS trabaja con módulos. Este archivo agrupa todos los archivos de auth y los hace funcionar juntos.

Usuario escribe usuario+contraseña
        ↓
  auth.controller  (recibe el request)
        ↓
  auth.service     (verifica si existe)
        ↓
  genera TOKEN JWT  (la pulsera)
        ↓
Usuario guarda el token
        ↓
En cada pedido siguiente manda el token
        ↓
jwt-auth.guard verifica el token
        ↓
Si es válido → deja pasar ✅
Si no → error 401 ❌
*/