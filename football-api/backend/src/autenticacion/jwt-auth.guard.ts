import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}




/*
jwt-auth.guard.ts — El portero
Este archivo es como un portero en la puerta. Antes de que alguien acceda a ver jugadores, e
l portero pregunta: "¿Tenés tu token?". Si no tiene token, lo rechaza.


*/