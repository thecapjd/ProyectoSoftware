// Importar módulos
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Configurar la aplicación Express
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configurar puerto
const PORT = process.env.PORT || 3000;

// Variables para seguimiento de usuarios y salas
const users = {};
const rooms = {};

// Configurar Socket.io
io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);
    
    // Gestionar el registro de un nuevo usuario
    socket.on('register', (username) => {
        users[socket.id] = {
            id: socket.id,
            username: username,
            room: null
        };
        
        // Notificar al usuario que se ha registrado correctamente
        socket.emit('registered', { id: socket.id, username: username });
        
        // Emitir la lista actualizada de usuarios
        io.emit('userList', Object.values(users));
        
        console.log(`Usuario registrado: ${username} (${socket.id})`);
    });
    
    // Gestionar la creación/unión a una sala
    socket.on('joinRoom', (roomName) => {
        // Salir de la sala actual si está en alguna
        if (users[socket.id].room) {
            socket.leave(users[socket.id].room);
            
            // Actualizar la lista de usuarios en la sala anterior
            io.to(users[socket.id].room).emit('roomUsers', 
                Object.values(users).filter(user => user.room === users[socket.id].room)
            );
        }
        
        // Unirse a la nueva sala
        socket.join(roomName);
        users[socket.id].room = roomName;
        
        // Crear la sala si no existe
        if (!rooms[roomName]) {
            rooms[roomName] = {
                name: roomName,
                messages: []
            };
        }
        
        // Enviar historial de mensajes al usuario
        socket.emit('roomHistory', rooms[roomName].messages);
        
        // Notificar a todos los usuarios en la sala
        io.to(roomName).emit('roomUsers', 
            Object.values(users).filter(user => user.room === roomName)
        );
        
        console.log(`Usuario ${users[socket.id].username} se unió a la sala: ${roomName}`);
    });
    
    // Gestionar mensajes en la sala
    socket.on('chatMessage', (message) => {
        const user = users[socket.id];
        
        if (user && user.room) {
            const messageData = {
                id: Date.now(),
                user: user.username,
                userId: socket.id,
                text: message,
                timestamp: new Date().toISOString()
            };
            
            // Guardar el mensaje en el historial de la sala
            rooms[user.room].messages.push(messageData);
            
            // Limitar el historial a 100 mensajes
            if (rooms[user.room].messages.length > 100) {
                rooms[user.room].messages.shift();
            }
            
            // Enviar el mensaje a todos los usuarios en la sala
            io.to(user.room).emit('message', messageData);
            
            console.log(`Mensaje de ${user.username} en ${user.room}: ${message}`);
        }
    });
    
    // Gestionar la escritura en curso
    socket.on('typing', (isTyping) => {
        const user = users[socket.id];
        
        if (user && user.room) {
            // Notificar a todos los usuarios en la sala excepto al remitente
            socket.to(user.room).emit('userTyping', { 
                userId: socket.id, 
                username: user.username, 
                isTyping 
            });
        }
    });
    
    // Gestionar la desconexión
    socket.on('disconnect', () => {
        const user = users[socket.id];
        
        if (user) {
            // Notificar a los usuarios de la sala si estaba en alguna
            if (user.room) {
                socket.to(user.room).emit('userLeft', { 
                    userId: socket.id, 
                    username: user.username 
                });
            }
            
            // Eliminar usuario
            delete users[socket.id];
            
            // Actualizar lista de usuarios
            io.emit('userList', Object.values(users));
            
            console.log(`Usuario desconectado: ${user.username} (${socket.id})`);
        }
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto: ${PORT}`);
});
