# Tech Help Desk - API

**Coder:** Jackson Ledezma  
**Clan:** Ubuntu

API de help desk técnico (NestJS + TypeORM + JWT) con roles Admin, Técnico y Cliente. Respuestas estándar `{ success, data, message }` y Swagger en `/api/docs`. Al registrar un cliente se crea también en la tabla de clientes.

## 1) Levantar el proyecto
1. Copia variables y ajusta credenciales:
```bash
cp .env.example .env
```
Variables mínimas:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=tech_help_desk
JWT_SECRET=un-secreto-seguro
NODE_ENV=development
```
2. Instala dependencias:
```bash
npm install
```
3. Ejecuta en desarrollo:
```bash
npm run start:dev
```
4. (Opcional) Poblar datos de prueba:
```bash
npm run seed
```
5. Producción:
```bash
npm run build
npm run start:prod
```

## 2) Swagger
- URL local: `http://localhost:3000/api/docs`
- Usa el botón Authorize con Bearer JWT.

## 3) Endpoints clave (ejemplos)

Autenticación
- `POST /auth/register`
```json
{
  "email": "user@example.com",
  "password": "Pass123!",
  "name": "User",
  "role": "cliente",
  "company": "Acme Corp"
}
```
- `POST /auth/login`
```json
{ "email": "user@example.com", "password": "Pass123!" }
```
- `GET /auth/profile` (Bearer)

Tickets
- Crear (Cliente/Admin): `POST /tickets`
```json
{ "title": "Impresora", "description": "Error 50", "categoryId": "<uuid>", "clientId": "<uuid>", "priority": "alta" }
```
- Cambiar estado (Téc/Admin): `PATCH /tickets/:id/status`
```json
{ "status": "en_progreso" }
```
- Asignar técnico (Admin): `PATCH /tickets/:id/assign`
```json
{ "technicianId": "<uuid-tecnico>" }
```
- Actualizar ticket (Admin/Téc según guard): `PATCH /tickets/:id`
```json
{ "title": "Nuevo título opcional", "priority": "media" }
```
- Eliminar (Admin): `DELETE /tickets/:id`
- Listar todos (Admin): `GET /tickets`
- Mis tickets (Cliente/Admin): `GET /tickets/my-tickets`
- Asignados (Téc/Admin): `GET /tickets/assigned`
- Por cliente: `GET /tickets/client/:id`
- Por técnico: `GET /tickets/technician/:id`
- Cambiar estado (Téc/Admin): `PATCH /tickets/:id/status`
```json
{ "status": "en_progreso" }
```
- Asignar técnico (Admin): `PATCH /tickets/:id/assign`
```json
{ "technicianId": "<uuid>" }
```

Usuarios (Admin)
- Crear: `POST /users`
```json
{ "email": "new.user@example.com", "password": "Pass123!", "name": "New User", "role": "cliente" }
```
- Actualizar: `PATCH /users/:id`
```json
{ "name": "Updated Name", "role": "tecnico" }
```
- Eliminar: `DELETE /users/:id`

Clientes (Admin)
- Crear: `POST /clients`
```json
{ "name": "Cliente 1", "company": "Acme", "contactEmail": "cliente1@acme.com" }
```
- Actualizar: `PATCH /clients/:id`
```json
{ "company": "Acme Updated" }
```
- Eliminar: `DELETE /clients/:id`

Técnicos (Admin)
- Crear: `POST /technicians`
```json
{ "name": "Tech 1", "specialty": "Redes", "availability": true }
```
- Actualizar: `PATCH /technicians/:id`
```json
{ "availability": false }
```
- Eliminar: `DELETE /technicians/:id`

Categorías (Admin)
- Crear: `POST /categories`
```json
{ "name": "Hardware", "description": "Incidencias físicas" }
```
- Actualizar: `PATCH /categories/:id`
```json
{ "description": "Impresoras y PCs" }
```
- Eliminar: `DELETE /categories/:id`

## 4) Tests
- Unit tests: `npm test`
- Cobertura: `npm run test:cov`

## 5) Seeds (datos de prueba)
`npm run seed` crea:
- Usuarios: admin@example.com (Admin123!), tech@example.com (Tech123!), client@example.com (Client123!)
- Categorías: Hardware, Software
- Clientes: Acme Corp, Globex
- Técnicos: María López, Juan Pérez
- Tickets de ejemplo con estados/prioridades
