# 🧩 Requisitos del Sistema

## ✅ Requisitos Funcionales

### 👤 Gestión de Usuarios

- **RF1.1**: El sistema permitirá el registro de usuarios mediante email y contraseña.  
- **RF1.2**: El sistema implementará autenticación de dos factores.  
- **RF1.3**: Los usuarios podrán editar su perfil y foto.  
- **RF1.4**: Los usuarios podrán agregar contactos mediante búsqueda o invitación.  

### 💬 Mensajería en Tiempo Real

- **RF2.1**: Los usuarios podrán enviar mensajes de texto en tiempo real.  
- **RF2.2**: El sistema notificará cuando un mensaje sea entregado y leído.  
- **RF2.3**: Los usuarios podrán ver el estado de conexión de sus contactos.  
- **RF2.4**: Los mensajes se entregarán tan pronto el destinatario esté en línea.  

### 🔐 Seguridad y Encriptación

- **RF3.1**: Todos los mensajes serán encriptados de extremo a extremo.  
- **RF3.2**: El sistema generará y gestionará pares de claves para cada usuario.  
- **RF3.3**: Las claves privadas nunca se transmitirán al servidor.  
- **RF3.4**: El sistema permitirá verificación de claves entre usuarios.  

### 🖥️ Interfaz de Usuario

- **RF4.1**: La UI mostrará una lista de conversaciones recientes.  
- **RF4.2**: La interfaz permitirá enviar y recibir mensajes con indicadores visuales.  
- **RF4.3**: Los usuarios recibirán notificaciones de nuevos mensajes.  
- **RF4.4**: La interfaz será responsive para adaptarse a diferentes dispositivos.  

---

## ⚙️ Requisitos No Funcionales

### 🚀 Rendimiento

- **RNF1.1**: El tiempo de entrega de mensajes no superará los 500ms en condiciones normales.  
- **RNF1.2**: El sistema deberá soportar al menos 10,000 usuarios concurrentes.  
- **RNF1.3**: El consumo de recursos del cliente debe ser optimizado para dispositivos móviles.  

### 🔒 Seguridad

- **RNF2.1**: Implementación de cifrado AES-256 para el contenido de los mensajes.  
- **RNF2.2**: Uso de RSA-2048 o superior para intercambio de claves.  
- **RNF2.3**: Almacenamiento seguro de datos de usuario siguiendo estándares OWASP.  
- **RNF2.4**: Implementación de protección contra ataques MITM e inyección.  

### ☁️ Disponibilidad y Confiabilidad

- **RNF3.1**: El sistema debe estar disponible el 99.9% del tiempo.  
- **RNF3.2**: Implementación de mecanismos de recuperación ante fallos.  
- **RNF3.3**: Capacidad de funcionamiento offline limitado con sincronización posterior.  

### 🎯 Usabilidad

- **RNF4.1**: La interfaz debe ser intuitiva y requerir mínima capacitación.  
- **RNF4.2**: El sistema debe funcionar en los navegadores principales (Chrome, Firefox, Safari, Edge).  
- **RNF4.3**: Tiempo de respuesta de la interfaz menor a 100ms.  

### 📈 Escalabilidad

- **RNF5.1**: Arquitectura que permita escalar horizontalmente.  
- **RNF5.2**: Diseño modular que facilite futuras expansiones.  
- **RNF5.3**: Uso de balanceadores de carga para distribuir el tráfico.  

---

## 🔄 Matriz de Trazabilidad

Esta matriz establece la relación entre los Requisitos Funcionales (RF) y los Requisitos No Funcionales (RNF), permitiendo verificar que cada requisito funcional está respaldado por los requisitos no funcionales correspondientes.

| RF / RNF | RNF1.1<br>Tiempo<br>entrega | RNF1.2<br>Usuarios<br>concurrentes | RNF1.3<br>Recursos<br>cliente | RNF2.1<br>AES-256 | RNF2.2<br>RSA-2048 | RNF2.3<br>OWASP | RNF2.4<br>Protección<br>ataques | RNF3.1<br>Disponibilidad | RNF3.2<br>Recuperación | RNF3.3<br>Offline | RNF4.1<br>Interfaz<br>intuitiva | RNF4.2<br>Navegadores | RNF4.3<br>Tiempo<br>respuesta | RNF5.1<br>Escala<br>horizontal | RNF5.2<br>Modular | RNF5.3<br>Balanceo |
|----------|-----------|------------|----------|---------|---------|---------|------------|--------------|-------------|----------|----------|-------------|------------|------------|---------|---------|
| RF1.1    |           |     ✓      |          |         |         |    ✓    |     ✓      |      ✓       |      ✓      |          |          |      ✓      |            |      ✓     |    ✓    |    ✓    |
| RF1.2    |           |     ✓      |          |         |    ✓    |    ✓    |     ✓      |      ✓       |      ✓      |          |          |      ✓      |            |      ✓     |    ✓    |         |
| RF1.3    |           |            |    ✓     |         |         |    ✓    |            |      ✓       |             |          |    ✓     |      ✓      |     ✓      |            |    ✓    |         |
| RF1.4    |           |     ✓      |          |         |         |    ✓    |            |      ✓       |             |          |    ✓     |      ✓      |     ✓      |      ✓     |    ✓    |    ✓    |
| RF2.1    |     ✓     |     ✓      |    ✓     |    ✓    |    ✓    |         |     ✓      |      ✓       |      ✓      |    ✓     |    ✓     |      ✓      |     ✓      |      ✓     |    ✓    |    ✓    |
| RF2.2    |     ✓     |     ✓      |    ✓     |         |         |         |            |      ✓       |      ✓      |    ✓     |    ✓     |      ✓      |     ✓      |      ✓     |    ✓    |    ✓    |
| RF2.3    |           |     ✓      |    ✓     |         |         |         |            |      ✓       |      ✓      |          |    ✓     |      ✓      |     ✓      |      ✓     |    ✓    |    ✓    |
| RF2.4    |     ✓     |     ✓      |          |         |         |         |            |      ✓       |      ✓      |    ✓     |          |      ✓      |            |      ✓     |    ✓    |    ✓    |
| RF3.1    |           |            |    ✓     |    ✓    |    ✓    |    ✓    |     ✓      |      ✓       |      ✓      |    ✓     |          |      ✓      |            |            |    ✓    |         |
| RF3.2    |           |     ✓      |    ✓     |    ✓    |    ✓    |    ✓    |     ✓      |      ✓       |      ✓      |    ✓     |          |      ✓      |            |      ✓     |    ✓    |         |
| RF3.3    |           |            |    ✓     |    ✓    |    ✓    |    ✓    |     ✓      |              |             |    ✓     |          |      ✓      |            |            |    ✓    |         |
| RF3.4    |           |            |    ✓     |    ✓    |    ✓    |    ✓    |     ✓      |      ✓       |             |          |    ✓     |      ✓      |     ✓      |            |    ✓    |         |
| RF4.1    |           |            |    ✓     |         |         |         |            |              |             |          |    ✓     |      ✓      |     ✓      |            |    ✓    |         |
| RF4.2    |     ✓     |            |    ✓     |         |         |         |            |              |             |          |    ✓     |      ✓      |     ✓      |            |    ✓    |         |
| RF4.3    |     ✓     |     ✓      |    ✓     |         |         |         |            |      ✓       |      ✓      |    ✓     |    ✓     |      ✓      |     ✓      |      ✓     |    ✓    |    ✓    |
| RF4.4    |           |            |    ✓     |         |         |         |            |              |             |          |    ✓     |      ✓      |     ✓      |            |    ✓    |         |

### 📊 Análisis de la Matriz de Trazabilidad

1. **Cobertura de requisitos**: Todos los requisitos funcionales están respaldados por múltiples requisitos no funcionales, asegurando que cada funcionalidad cumpla con los estándares de calidad definidos.

2. **Áreas críticas**: 
   - La mensajería en tiempo real (RF2.1) y las notificaciones (RF4.3) son las funcionalidades que más requisitos no funcionales impactan.
   - Los requisitos de seguridad están fuertemente vinculados a la encriptación de mensajes (RF3.1-RF3.4).

3. **Dependencias principales**:
   - El rendimiento (RNF1.x) afecta principalmente a las funcionalidades de mensajería.
   - La usabilidad (RNF4.x) impacta casi todas las funcionalidades de interfaz.
   - La escalabilidad (RNF5.x) es crucial para las funcionalidades que involucran múltiples usuarios simultáneos.

4. **Potenciales riesgos**:
   - Funcionalidades como la autenticación de dos factores (RF1.2) tienen alta dependencia de requisitos de seguridad.
   - El funcionamiento offline (RNF3.3) afecta a varios requisitos funcionales y debe gestionarse adecuadamente.

Esta matriz servirá como herramienta fundamental durante el desarrollo para asegurar que todas las implementaciones técnicas satisfagan tanto los requisitos funcionales como los no funcionales relacionados.