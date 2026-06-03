import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly users = [
    { id: 1, username: 'admin', password: 'admin123' },
    { id: 2, username: 'melina', password: 'melina123' },
  ];

  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = this.users.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

/*
auth.service.ts — La lógica del login
Este es el cerebro. Cuando alguien manda usuario y contraseña:

Busca si ese usuario existe
Si existe, genera un token (como una pulsera de entrada)
Devuelve ese token

*/