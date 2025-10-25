# 🔐 Testing del Sistema de Login

## 🎯 Credenciales de Prueba

El sistema actualmente funciona en **MODO DESARROLLO** con usuarios simulados.

### Usuarios Disponibles

```
┌──────────────┬──────────────┬──────────┐
│ Usuario      │ Contraseña   │ Rol      │
├──────────────┼──────────────┼──────────┤
│ admin        │ admin123     │ ADMIN    │
│ operador     │ operador123  │ OPERADOR │
│ usuario      │ usuario123   │ USUARIO  │
└──────────────┴──────────────┴──────────┘
```

## 🚀 Cómo Probar

1. **Iniciar el proyecto**
   ```bash
   npm run dev
   ```

2. **Navegar a** `http://localhost:5173`

3. **Login** con cualquiera de las credenciales de arriba

4. **Funcionalidades disponibles:**
   - ✅ Login con validación
   - ✅ Token JWT simulado guardado en localStorage
   - ✅ Navegación al dashboard después del login
   - ✅ Botón "Cerrar Sesión" en el header
   - ✅ Protección de rutas
   - ✅ Redirección automática si no hay token

## 🔄 Cambiar a Backend Real

Cuando el endpoint del backend esté listo:

### 1. Editar `src/api/authService.ts`

Buscar el método `login()` y hacer los siguientes cambios:

```typescript
// COMENTAR esta sección (líneas 27-70 aprox)
// ========================================
//  MODO DESARROLLO: Login simulado
// ========================================
/*
const mockUsers = [...];
...todo el código de simulación...
*/

// DESCOMENTAR esta línea
const response = await axios.post<LoginResponse>('/auth/login', credentials);
```

### 2. Verificar la URL del backend en `src/api/axios.ts`

```typescript
baseURL: 'http://localhost:8080/api', // Ajustar según tu backend
```

### 3. Remover el cuadro de credenciales en `src/pages/Login.tsx`

Eliminar el bloque:
```tsx
{/* CREDENCIALES DE PRUEBA - Eliminar cuando el backend esté listo */}
<div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
  ...
</div>
```

## 📡 Formato Esperado del Backend

### Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@municipalidad.com",
    "role": "ADMIN"
  }
}
```

### Response (401 Unauthorized)
```json
{
  "message": "Credenciales inválidas"
}
```

## 🧪 Testing Manual

### Escenarios a Probar

- [ ] Login exitoso con credenciales válidas
- [ ] Error con credenciales inválidas
- [ ] Redirección al dashboard después del login
- [ ] Token guardado en localStorage
- [ ] Cerrar sesión limpia el token
- [ ] Redirección al login después de cerrar sesión
- [ ] Protección de rutas (acceso sin token redirige a login)
- [ ] Token se envía en todas las peticiones

### Verificar en DevTools

1. **Abrir DevTools** → Application → Local Storage
2. **Después del login**, verificar:
   - `authToken`: debe contener el token
   - `userData`: debe contener los datos del usuario

3. **Network tab**, verificar que las peticiones tengan:
   ```
   Authorization: Bearer <token>
   ```

## 🎨 Características Visuales

- **Cuadro azul** en el login muestra las credenciales de prueba
- **Estado de carga** mientras se procesa el login
- **Toasts** para feedback (éxito/error)
- **Menú desplegable** en el header con botón de logout

## ⚠️ Notas Importantes

- El token simulado tiene el formato: `mock-jwt-token-{username}-{timestamp}`
- Hay un delay de 800ms simulado para emular latencia de red
- El sistema valida usuario Y contraseña (ambos deben coincidir)
- El logout limpia completamente el localStorage

## 🔜 Próximos Pasos

1. Implementar el endpoint `/auth/login` en el backend
2. Comentar el código de simulación
3. Descomentar la llamada real al backend
4. Probar con credenciales reales
5. Eliminar el cuadro de credenciales de prueba del UI