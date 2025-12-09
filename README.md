# Tech Help Desk - Authentication System

Sistema de autenticación y autorización basado en roles para un help desk técnico, implementado con NestJS, JWT y TypeORM.

## 🚀 Características Implementadas

### Autenticación JWT
- ✅ Login y registro de usuarios
- ✅ Tokens JWT con expiración de 24 horas
- ✅ Hash de contraseñas con bcrypt (10 salt rounds)
- ✅ Validación de credenciales
- ✅ Endpoint de perfil protegido

### Sistema de Roles
- **Administrador**: CRUD completo de todos los recursos
- **Técnico**: Consulta y actualización de tickets asignados
- **Cliente**: Registro de tickets y consulta de historial

### Guards Personalizados
- **JwtGuard**: Valida tokens JWT en rutas protegidas
- **RolesGuard**: Control de acceso basado en roles

### Decorators Personalizados
- **@Roles(Role.*)**: Define roles requeridos para endpoints
- **@CurrentUser()**: Extrae el usuario autenticado del request

## 📁 Estructura del Proyecto

```
src/
├── auth/                          # Módulo de autenticación
│   ├── dto/                       # DTOs para login y registro
│   ├── jwt/jwt.guard.ts          # Guard de JWT
│   ├── strategies/jwt.strategy.ts # Estrategia de Passport JWT
│   ├── auth.controller.ts        # Endpoints de autenticación
│   ├── auth.service.ts           # Lógica de autenticación
│   └── auth.module.ts            # Configuración del módulo
├── users/                         # Módulo de usuarios
│   ├── entities/user.entity.ts   # Entidad User con roles
│   ├── dto/                      # DTOs para usuarios
│   ├── users.controller.ts       # CRUD de usuarios (admin only)
│   ├── users.service.ts          # Lógica de negocio de usuarios
│   └── users.module.ts           # Configuración del módulo
├── common/                        # Módulo común
│   ├── decorators/               # Decorators personalizados
│   │   ├── current-user/         # @CurrentUser()
│   │   └── roles/                # @Roles()
│   ├── guards/                   # Guards personalizados
│   │   └── roles/roles.guard.ts  # RolesGuard
│   └── enums/role.enum.ts        # Enum de roles
└── app.module.ts                 # Módulo raíz con TypeORM
```

## 🔧 Configuración

### 1. Variables de Entorno

Copia `.env.example` a `.env` y configura:

```bash
cp .env.example .env
```

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
DB_DATABASE=tech_help_desk

# JWT
JWT_SECRET=tu-secreto-jwt-seguro

# Environment
NODE_ENV=development
```

### 2. Base de Datos

Crea la base de datos PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE tech_help_desk;
\q
```

TypeORM creará las tablas automáticamente en modo desarrollo.

### 3. Instalación y Ejecución

```bash
# Instalar dependencias (ya instaladas)
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

## 📡 API Endpoints

### Autenticación

#### Registro
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario",
  "role": "cliente"  // opcional: administrador, tecnico, cliente (default)
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "cliente"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### Perfil (Protegido)
```http
GET /auth/profile
Authorization: Bearer {token}
```

### Gestión de Usuarios (Solo Administrador)

```http
GET    /users              # Listar todos los usuarios
GET    /users/:id          # Obtener un usuario
POST   /users              # Crear usuario
PATCH  /users/:id          # Actualizar usuario
DELETE /users/:id          # Eliminar usuario

# Todos requieren:
Authorization: Bearer {admin_token}
```

## 🧪 Testing

### Script de Prueba Automatizado

Ejecuta el script de prueba incluido:

```bash
# Asegúrate de que la aplicación esté corriendo
npm run start:dev

# En otra terminal, ejecuta:
./test-auth.sh
```

Este script prueba:
- ✅ Registro de usuarios con diferentes roles
- ✅ Login de usuarios
- ✅ Acceso a perfiles protegidos
- ✅ Control de acceso basado en roles
- ✅ Rechazo de acceso no autorizado

### Pruebas Manuales con cURL

Ver `walkthrough.md` para ejemplos detallados de pruebas con cURL.

## 🔒 Seguridad

### Implementado
- ✅ Hash de contraseñas con bcrypt
- ✅ Tokens JWT firmados
- ✅ Validación de entrada con class-validator
- ✅ Guards para protección de rutas
- ✅ Roles enum para type-safety

### Recomendaciones para Producción
- [ ] Cambiar `JWT_SECRET` a un valor aleatorio fuerte
- [ ] Deshabilitar `synchronize` en TypeORM (usar migraciones)
- [ ] Implementar rate limiting en endpoints de auth
- [ ] Añadir refresh tokens
- [ ] Implementar verificación de email
- [ ] Usar HTTPS en producción
- [ ] Añadir validación de fortaleza de contraseña

## 📚 Ejemplos de Uso

### Proteger un Endpoint con Roles

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from './auth/jwt/jwt.guard';
import { RolesGuard } from './common/guards/roles/roles.guard';
import { Roles } from './common/decorators/roles/roles.decorator';
import { CurrentUser } from './common/decorators/current-user/current-user.decorator';
import { Role } from './common/enums/role.enum';
import { User } from './users/entities/user.entity';

@Controller('tickets')
@UseGuards(JwtGuard, RolesGuard)
export class TicketsController {
  // Solo administradores
  @Get('all')
  @Roles(Role.ADMINISTRADOR)
  findAll() {
    return this.ticketsService.findAll();
  }

  // Técnicos y administradores
  @Get('assigned')
  @Roles(Role.TECNICO, Role.ADMINISTRADOR)
  getAssigned(@CurrentUser() user: User) {
    return this.ticketsService.findByTechnician(user.id);
  }

  // Clientes y administradores
  @Get('my-tickets')
  @Roles(Role.CLIENTE, Role.ADMINISTRADOR)
  getMyTickets(@CurrentUser() user: User) {
    return this.ticketsService.findByClient(user.id);
  }
}
```

## 🛠️ Tecnologías Utilizadas

- **NestJS** - Framework backend
- **TypeORM** - ORM para PostgreSQL
- **Passport JWT** - Estrategia de autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs
- **PostgreSQL** - Base de datos relacional

## 📝 Próximos Pasos

Para extender el sistema a otros módulos:

1. **Técnicos Module**: Implementar lógica para que técnicos solo vean tickets asignados
2. **Tickets Module**: Añadir control de acceso basado en roles
3. **Categories Module**: Restringir CRUD a administradores
4. **Notificaciones**: Sistema de notificaciones por rol
5. **Dashboard**: Diferentes vistas según rol de usuario

## 📄 Documentación Adicional

- `implementation_plan.md` - Plan de implementación detallado
- `walkthrough.md` - Guía completa de la implementación
- `task.md` - Lista de tareas completadas

## 👥 Roles y Permisos

| Endpoint | Administrador | Técnico | Cliente |
|----------|--------------|---------|---------|
| POST /auth/register | ✅ | ✅ | ✅ |
| POST /auth/login | ✅ | ✅ | ✅ |
| GET /auth/profile | ✅ | ✅ | ✅ |
| GET /users | ✅ | ❌ | ❌ |
| POST /users | ✅ | ❌ | ❌ |
| PATCH /users/:id | ✅ | ❌ | ❌ |
| DELETE /users/:id | ✅ | ❌ | ❌ |

## 🐛 Troubleshooting

### Error de conexión a la base de datos
```bash
# Verifica que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verifica las credenciales en .env
```

### Token inválido
- Asegúrate de incluir el prefijo "Bearer " en el header
- Verifica que el token no haya expirado (24h)

### 403 Forbidden en endpoint
- Verifica que el usuario tenga el rol correcto
- Asegúrate de que el token sea válido

## 📞 Soporte

Para más información, consulta la documentación en la carpeta `brain/` o revisa el código fuente.

---

**Desarrollado con ❤️ usando NestJS**
