# FIFA Players Manager — Santex Academy Challenge

## ¿Cómo correr el proyecto?

1. Clonar el repositorio:
   git clone https://github.com/MelinaYainMedina/MelinaMedina-SantexAcademy.git

2. Entrar a la carpeta:
   cd MelinaMedina-SantexAcademy/football-api

3. Copiar el archivo de variables de entorno:
   cp .env.sample .env

4. Agregar tu GROQ_API_KEY en el .env:
   GROQ_API_KEY=tu_clave_de_groq

5. Levantar con Docker:
   docker compose up

6. Abrir en el navegador:
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000
   - Credenciales: usuario melina / contraseña melina123

## Funcionalidades implementadas

- Login con JWT — autenticación segura
- Listado de jugadores con paginación y filtros (nombre, club, posición)
- Descarga de CSV del listado filtrado
- Detalle de jugador con gráfico radar de habilidades
- Editar jugador con validaciones
- Crear jugador (Melina Medina — jugadora creada con mis skills)
- Guard de rutas — protege todas las rutas sin autenticación
- Línea de tiempo de evolución de skills (FIFA 15 a FIFA 23)
- Análisis con IA — usa Groq (LLaMA) para generar un párrafo descriptivo de la evolución

## Decisiones técnicas

- Backend: NestJS + Sequelize + MySQL
- Frontend: Angular 17 standalone components
- Autenticación: JWT con Passport
- Gráfico radar: Canvas API nativo
- Gráfico de línea de tiempo: Canvas API nativo
- IA: Groq API con modelo llama-3.1-8b-instant
- Repositorio pattern para desacoplar la lógica de datos

## Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /auth/login | Login, devuelve JWT |
| GET | /api/players | Listado con filtros y paginación |
| GET | /api/players/:id | Detalle de un jugador |
| POST | /api/players | Crear jugador |
| PATCH | /api/players/:id | Editar jugador |
| GET | /api/players/:id/history | Historial de skills por año |
| GET | /api/players/:id/analysis | Análisis de evolución con IA |

| POST | /api/players/import | Importar jugadores desde CSV |

## Importar jugadores desde CSV (Punto extra)

Permite subir un archivo CSV con jugadores y cargarlos a la base de datos.

### Ejemplo de uso:
```bash
# 1. Obtener token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"melina","password":"melina123"}'

# 2. Importar CSV
curl -X POST http://localhost:3000/api/players/import \
  -H "Authorization: Bearer TU_TOKEN" \
  -F "file=@archivo.csv"
```

### Formato del CSV: long_name,club_name,player_positions,nationality_name,overall,pace,shooting,passing,dribbling,defending,physic
Melina Test,FC Barcelona,ST,Argentina,85,80,75,70,82,45,70

### Respuesta exitosa:
```json
{ "imported": 1, "errors": 0 }
```