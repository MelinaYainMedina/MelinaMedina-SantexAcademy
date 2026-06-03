import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }
}

/*
auth.controller.ts — La puerta de entrada
Define la URL del login: POST /auth/login. Cuando alguien hace una petición ahí con usuario y contraseña, llama al service.

*/