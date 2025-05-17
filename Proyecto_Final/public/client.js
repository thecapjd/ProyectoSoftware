// Conectar al servidor Socket.io
const socket = io();

// Cache de elementos DOM
const loginForm = document.getElementById('login-form');
const userProfile = document.getElementById('user-profile');
const usernameInput = document.getElementById('username-input');
const usernameDisplay = document.getElementById('username-display');
const loginBtn = document.getElementById('login-btn');
const roomInput = document.getElementById('room-input');
const joinBtn = document.getElementById('join-btn');
const currentRoomDisplay = document.getElementById('current-room');
const usersList = document.getElementById('users-list');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

// Estado de la aplicación
let currentUser = null;
let currentRoom = null;
let typingTimeout = null;

// Deshabilitar la interfaz inicialmente
joinBtn.disabled = true;
messageInput.disabled = true;

// Manejador para registrar un usuario
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    
    if (username) {
        socket.emit('register', username);
    }
});

// Manejador para unirse a una sala
joinBtn.addEventListener('click', () => {
    const roomName = roomInput.value.trim();
    
    if (roomName) {
        socket.emit('joinRoom', roomName);
        currentRoom = roomName;
        currentRoomDisplay.textContent = roomName;
        messageInput.disabled = false;
    }
});

// Manejador para enviar mensajes
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const message = messageInput.value.trim();
    
    if (message && currentRoom) {
        socket.emit('chatMessage', message);
        messageInput.value = '';
        messageInput.focus();
    }
});

// Manejador para detectar escritura
messageInput.addEventListener('input', () => {
    if (!currentRoom) return;
    
    // Emitir evento de escritura
    socket.emit('typing', true);
    
    // Limpiar timeout anterior si existe
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
    
    // Configurar un nuevo timeout para detener la indicación de escritura
    typingTimeout = setTimeout(() => {
        socket.emit('typing', false);
    }, 1000);
});

// === Socket.io Listeners ===

// Cuando el usuario se registra exitosamente
socket.on('registered', (user) => {
    currentUser = user;
    
    // Actualizar la interfaz
    loginForm.classList.add('hidden');
    userProfile.classList.remove('hidden');
    usernameDisplay.textContent = user.username;
    
    // Habilitar la unión a salas
    joinBtn.disabled = false;
});

// Cuando se recibe la lista de usuarios
socket.on('userList', (users) => {
    // Podríamos mostrar esto en otra parte de la UI
    console.log('Usuarios conectados:', users);
});

// Cuando se reciben los usuarios de una sala
socket.on('roomUsers', (users) => {
    // Actualizar la lista de usuarios en la sala
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.username;
        
        // Resaltar al usuario actual
        if (currentUser && user.id === currentUser.id) {
            li.style.fontWeight = 'bold';
        }
        
        usersList.appendChild(li);
    });
});

// Cuando se recibe el historial de mensajes de una sala
socket.on('roomHistory', (messages) => {
    // Limpiar el contenedor de mensajes
    messagesContainer.innerHTML = '';
    
    // Mostrar el historial de mensajes
    messages.forEach(message => {
        displayMessage(message);
    });
    
    // Desplazarse hacia el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Cuando se recibe un mensaje nuevo
socket.on('message', (message) => {
    displayMessage(message);
    
    // Desplazarse hacia el último mensaje
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Cuando un usuario está escribiendo
socket.on('userTyping', ({ userId, username, isTyping }) => {
    if (isTyping) {
        typingIndicator.textContent = `${username} está escribiendo...`;
    } else {
        typingIndicator.textContent = '';
    }
});

// Cuando un usuario abandona la sala
socket.on('userLeft', ({ userId, username }) => {
    // Mostrar mensaje de sistema
    const systemMessage = {
        id: Date.now(),
        user: 'Sistema',
        text: `${username} ha abandonado la sala.`,
        timestamp: new Date().toISOString(),
        isSystem: true
    };
    
    displayMessage(systemMessage);
});

// === Funciones de utilidad ===

// Función para mostrar un mensaje en el chat
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Determinar si es un mensaje enviado o recibido
    if (currentUser && message.userId === currentUser.id) {
        messageElement.classList.add('sent');
    } else {
        messageElement.classList.add('received');
    }
    
    // Si es un mensaje del sistema, darle estilo especial
    if (message.isSystem) {
        messageElement.style.backgroundColor = '#f8f9fa';
        messageElement.style.borderLeft = '3px solid #6c757d';
        messageElement.style.fontStyle = 'italic';
    }
    
    // Crear la cabecera del mensaje
    const headerElement = document.createElement('div');
    headerElement.classList.add('message-header');
    
    // Nombre de usuario
    const usernameElement = document.createElement('span');
    usernameElement.textContent = message.user;
    headerElement.appendChild(usernameElement);
    
    // Timestamp
    const timeElement = document.createElement('span');
    const messageDate = new Date(message.timestamp);
    timeElement.textContent = messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    headerElement.appendChild(timeElement);
    
    // Agregar cabecera al mensaje
    messageElement.appendChild(headerElement);
    
    // Texto del mensaje
    const textElement = document.createElement('div');
    textElement.textContent = message.text;
    messageElement.appendChild(textElement);
    
    // Agregar el mensaje al contenedor
    messagesContainer.appendChild(messageElement);
}
