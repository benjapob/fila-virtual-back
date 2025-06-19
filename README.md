# Backend de Fila Virtual

Backend para un proyecto simple pero que utiliza varias tecnologías para lograr una fila virtual en tiempo real con un CRUD de turnos.

## Tabla de Contenidos
- [Prerrequisitos](#prerrequisitos)
- [Instalación](#instalación)
- [Ejecutar la Aplicación](#ejecutar-la-aplicación)

## Prerrequisitos
- **Node.js**: Versión 14 o superior.
- **npm**: Versión 6 o superior.
- Un editor de código (por ejemplo, VS Code) para desarrollo.

## Instalación
1. **Clonar el repositorio** (si aplica):
   ```bash
   git clone https://github.com/benjapob/fila-virtual-back.git
   cd fila-virtual-back
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```
   Esto instala los paquetes necesarios:
   - `express`: Framework web para la API.
   - `mongoose`: Conexión de base de datos MongoDB.
   - `socket.io`: Para comunicación WebSocket en tiempo real.
   - `moment`: Para manejo de fechas (considera reemplazar por `date-fns`).
   - `cors`, `helmet`, `express-rate-limit`: Para seguridad y manejo de CORS.
   - `typescript`, `ts-node`, `nodemon`: Para TypeScript y desarrollo.

3. **Configurar variables de entorno**:
    (opcional)
   Crea un archivo `.env` en la raíz del proyecto con lo siguiente:
   ```env
   PORT=3000
   ENV=DEV
   MONGO_URI=mongodb+srv://example:examplepwd@cluster0.jxkjzqn.mongodb.net/?retryWrites=true&w=majority
   ALLOWED_ORIGINS=http://localhost:3000,http://example.com
   ```
   - `PORT`: Puerto donde se ejecuta el servidor.
   - `MONGO_URI`: URI de conexión a mongoDB.
   - `ENV`: `DEV` para desarrollo (permite todos los orígenes CORS) o `PROD` para producción (restringe a `ALLOWED_ORIGINS`).
   - `ALLOWED_ORIGINS`: Lista de orígenes CORS permitidos, separados por comas (usado en producción).

4. **Inicializar la base de datos**:
   La conexión se ejecuta al momento de inicializar el servidor. No se requiere configuración manual de la base de datos.

## Ejecutar la Aplicación
1. **Compilar el proyecto**:
   ```bash
   npm run build
   ```
   Esto compila los archivos TypeScript de `src/` a `dist/`.

2. **Iniciar la aplicación**:
   ```bash
   npm start
   ```
   El servidor se ejecutará en `http://localhost:3000` (o el puerto especificado en `.env`).

3. **Modo de desarrollo** (con recarga automática):
   ```bash
   npm run dev
   ```
   Usa `nodemon` y `ts-node` para ejecutar la aplicación y recargar al modificar el código.

4. **Endpoints de la API**:
   - `GET /getTurnos`: Obtiene todos los turnos.
   - `POST /createTurno`: Crea una nuevo turno (requiere `motivo`, `prioridad`, `horaRegistro`, `consultorio`, `medico` y `paciente`, en el cuerpo)
   - `DELETE /deleteTurno`: Elimina una tarea (requiere `_id` en el cuerpo).

   Ejemplo de cuerpo para `POST /createTurno`:
   ```json
   {
     "motivo": "Dolor de Cabeza",
     "prioridad": "Alta",
     "horaRegistro": "01-01-2025",
     "consultorio": "Hospital del Profesor",
     "medico": "José Diaz",
     "paciente": "Rosa Barrera"
   }
   ```

