# FIFA Players Manager — Santex Academy Challenge

## ¿Cómo correr el proyecto?

1. Clonar el repositorio:
   git clone https://github.com/MelinaYainMedina/MelinaMedina-SantexAcademy.git

2. Entrar a la carpeta:
   cd MelinaMedina-SantexAcademy/football-api

3. Copiar el archivo de variables de entorno:
   cp .env.sample .env

4. Levantar con Docker:
   docker compose up

5. Abrir en el navegador:
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000
   - Credenciales: usuario `melina` / contraseña `melina123`

## Funcionalidades implementadas

- Login con JWT
- Listado de jugadores con paginación y filtros
- Descarga de CSV
- Detalle de jugador con gráfico radar de habilidades
- Editar jugador
- Crear jugador (Melina Medina — ID 161584)
- Guard de rutas (protege todas las rutas sin autenticación)

## Decisiones técnicas

- Backend: NestJS + Sequelize + MySQL
- Frontend: Angular 17 standalone components
- Autenticación: JWT con Passport
- Gráfico radar: Canvas API nativo (sin librerías externas)
- Repositorio pattern para desacoplar la lógica de datos

## Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/login | Login, devuelve JWT |
| GET | /api/players | Listado con filtros y paginación |
| GET | /api/players/:id | Detalle de un jugador |
| POST | /api/players | Crear jugador |
| PATCH | /api/players/:id | Editar jugador |