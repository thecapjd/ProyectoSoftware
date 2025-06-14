# Documentación del Servidor de Chat y Pruebas de Seguridad

Este documento describe la configuración del servidor de chat, la estructura de la base de datos, los endpoints de autenticación y, crucialmente, las medidas de seguridad implementadas para proteger la información del usuario.

## 1. Configuración de la Base de Datos SQLite

La aplicación utiliza SQLite como su sistema de gestión de base de datos. Al iniciar el servidor, se realizan las siguientes verificaciones y creaciones de tablas si no existen, asegurando la integridad de la estructura de datos:

- **Conexión a la base de datos SQLite**: Se establece una conexión con el archivo `chat.db` o una base de datos en memoria (`:memory:`) para propósitos de prueba.

- **Tabla 'users'**: 
  - Verificada/creada.
  - Diseñada para almacenar la información de los usuarios registrados, incluyendo credenciales de forma segura.

- **Tabla 'friend_requests'**: 
  - Verificada/creada.
  - Gestiona las solicitudes de amistad entre usuarios.

- **Tabla 'friendships'**: 
  - Verificada/creada.
  - Almacena las relaciones de amistad confirmadas.

- **Tabla 'messages'**: 
  - Verificada/creada.
  - Contiene los mensajes intercambiados entre usuarios.
  - Columnas adicionales para manejo de archivos: 
    - `file_name`: Nombre original del archivo adjunto.
    - `file_size`: Tamaño del archivo en bytes.
    - `file_type`: Tipo MIME del archivo.
    - `file_data`: Contenido binario del archivo (almacenado directamente o referencia a un sistema de almacenamiento).

## 2. Autenticación de Usuarios

La aplicación implementa un sistema robusto de autenticación para el registro y el inicio de sesión, utilizando técnicas de seguridad estándar de la industria.

### 2.1 Registro de Usuarios (`/register`)

- **Funcionalidad**: Permite a nuevos usuarios crear una cuenta en el sistema.
- **Proceso**: 
  - El usuario envía su `username` (correo electrónico) y `password`.
  - La contraseña es hasheada utilizando `bcrypt` antes de ser almacenada en la base de datos. Esto es una medida crítica de seguridad para evitar que las contraseñas se almacenen en texto plano.
  - Se verifica si el usuario ya existe para evitar duplicados.
- **Respuestas HTTP**: 
  - `201 Created`: Usuario registrado exitosamente.
  - `409 Conflict`: El usuario ya existe.

### 2.2 Inicio de Sesión de Usuarios (`/login`)

- **Funcionalidad**: Permite a los usuarios autenticarse para acceder a los servicios del chat.
- **Proceso**: 
  - El usuario envía su `username` y `password`.
  - La contraseña proporcionada es comparada con el hash almacenado en la base de datos utilizando `bcrypt.compare()`. Este método es seguro porque compara los hashes sin necesidad de deshashear la contraseña almacenada.
  - Si las credenciales son correctas, se emite un JSON Web Token (JWT) que el cliente debe usar para futuras solicitudes autenticadas.
- **Respuestas HTTP**: 
  - `200 OK`: Login exitoso. Se devuelve un token JWT.
  - `401 Unauthorized`: Usuario o contraseña incorrectos.

### 2.3 Medida de Seguridad para Contraseñas Incorrectas (Mensaje de Error Específico)

**Concepto de Seguridad**: Para evitar ataques de enumeración de usuarios (donde un atacante podría deducir si un nombre de usuario existe basándose en mensajes de error diferentes para usuarios inexistentes vs. contraseñas incorrectas), se ha configurado un mensaje de error genérico para intentos de login fallidos.

**Implementación** (líneas 202-206 en `server.js`):

```javascript
202  const isMatch = await bcrypt.compare(password, user.password);
203  if (!isMatch) {
204 >   console.warn('Intento de login fallido: Contraseña incorrecta para \'testuser@uni.pe\'.');
205    return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
206  }
```

- **Línea 204** (`console.warn`): Internamente, en los logs del servidor, se registra un warn con el detalle específico (Contraseña incorrecta para 'testuser@uni.pe'.). Esto es útil para la depuración y el monitoreo interno del sistema, permitiendo a los administradores identificar intentos de acceso no autorizados.

- **Línea 205** (`res.status(401).json`): Sin embargo, al cliente (el navegador o la aplicación) siempre se le devuelve el mensaje genérico 'Usuario o contraseña incorrectos.'. Este mensaje no distingue entre "el usuario no existe" y "la contraseña es incorrecta para este usuario existente".

**Beneficio de Seguridad**: Esta estrategia ayuda a mitigar ataques de fuerza bruta y enumeración de usuarios, ya que un atacante no puede obtener información sobre la existencia de un usuario a partir de la respuesta del servidor en caso de un login fallido. Todo intento de login fallido, independientemente de la razón (usuario inexistente o contraseña incorrecta), recibe la misma respuesta ambigua.

## 3. Pruebas de Unidad e Integración (`server.test.js`)

Se ha implementado un conjunto de pruebas exhaustivo utilizando Jest y Supertest para garantizar la fiabilidad y seguridad del servidor.

### 3.1 Pruebas de Unidad: `generateChatId`

- **Propósito**: Validar el correcto funcionamiento de la función `generateChatId`.
- **Detalles**: Esta función es crucial para la consistencia en la identificación de conversaciones entre dos usuarios, asegurando que el ID de chat sea siempre el mismo, independientemente del orden en que se proporcionen los usuarios (ej. `user1_user2` o `user2_user1`).

### 3.2 Pruebas de Integración: Endpoints de Autenticación

Estas pruebas verifican el comportamiento de los endpoints `/register` y `/login` en un entorno cercano a la producción, utilizando una base de datos en memoria para aislar las pruebas de la base de datos real.

- **POST /register - Debe registrar un nuevo usuario correctamente**: 
  - Verifica que el endpoint `/register` devuelve un status `201` y el mensaje de éxito esperado al registrar un usuario nuevo y válido.

- **POST /register - Debe fallar si el usuario ya existe**: 
  - Asegura que el endpoint maneja correctamente los intentos de registrar usuarios duplicados, devolviendo un status `409` y el mensaje de error apropiado.

- **POST /login - Debe autenticar al usuario y devolver un token JWT**: 
  - Confirma que un usuario con credenciales correctas puede iniciar sesión, recibiendo un status `200` y un token JWT en la respuesta.

- **POST /login - Debe fallar con credenciales incorrectas**: 
  - **Crucial para la seguridad**: Esta prueba verifica específicamente que un intento de login con una contraseña incorrecta (ej. `password_incorrecto`) resulta en un status `401 Unauthorized` y el mensaje genérico 'Usuario o contraseña incorrectos.'. Esto valida la medida de seguridad discutida en la sección 2.3, confirmando que la aplicación no revela información sensible sobre la existencia del usuario a un atacante.

### 3.3 Consideraciones sobre el Entorno de Pruebas

- **Base de datos en memoria** (`:memory:`): Las pruebas utilizan una base de datos SQLite en memoria, lo que asegura que cada ejecución de prueba se realiza en un entorno limpio y no persistente, evitando afectar la base de datos de producción o pruebas anteriores.

- **Cierre del servidor** (`afterAll`): Se incluye un `afterAll` para cerrar el servidor (`server.close(done)`) después de que todas las pruebas hayan finalizado. Esto es fundamental para que Jest pueda terminar el proceso de forma limpia y liberar recursos.

## 4. Estado Actual de las Pruebas

Según el último reporte de ejecución:

- **Test Suites**: 1 fallida, 1 total.
- **Tests**: 5 pasados, 5 total.

**Análisis del fallo**: El informe indica un fallo en el test suite, específicamente que "Server is not running". Esto sugiere un problema en el setup o teardown del servidor durante la ejecución de las pruebas, o que la aplicación principal no estaba iniciada o accesible para las pruebas de integración. A pesar de que los 5 tests individuales pasaron (lo que valida la lógica de registro, login, y generación de Chat ID), el entorno de pruebas de integración no pudo ejecutar completamente la suite debido a que el servidor no estaba activo para las pruebas.

![image](https://github.com/user-attachments/assets/0dc43da5-b0af-4bfd-8f3b-89ab59ca42a5)
![image](https://github.com/user-attachments/assets/1a23cf9c-64b0-4cec-b90a-b92195207bcf)
