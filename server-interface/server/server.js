const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

const PORT = process.env.PORT || 8000;
let clients = {};
let chatRooms = {};  // Objeto para armazenar mensagens de cada sala

app.use(cors());

// Rota para listar todos os clientes conectados
app.get('/clients', (req, res) => {
    res.json(clients);
});

// Rota para listar mensagens de uma sala específica
app.get('/messages/:room', (req, res) => {
    const room = req.params.room;
    const messages = chatRooms[room] || [];
    res.json(messages);
});

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Adiciona o cliente à lista de clientes conectados
    clients[socket.id] = { id: socket.id, name: `Client ${Object.keys(clients).length + 1}` };

    // Evento para o cliente entrar em uma sala específica
    socket.on('join room', (room) => {
        socket.join(room);
        console.log(`${clients[socket.id].name} joined room: ${room}`);

        // Inicializa o histórico da sala se ainda não existir
        if (!chatRooms[room]) {
            chatRooms[room] = [];
        }

        // Envia o histórico da sala para o cliente recém-conectado
        socket.emit('chat history', chatRooms[room]);
    });

    // Evento para sair de uma sala
    socket.on('leave room', (room) => {
        socket.leave(room);
        console.log(`${clients[socket.id].name} left room: ${room}`);
    });

    // Quando uma mensagem é recebida de um cliente
    socket.on('message', ({ room, message }) => {
        const msg = {
            id: socket.id,
            name: clients[socket.id].name,
            message: message,
            timestamp: new Date().toLocaleTimeString(),
        };

        // Armazena a mensagem no histórico da sala
        if (chatRooms[room]) {
            chatRooms[room].push(msg);
        } else {
            chatRooms[room] = [msg];
        }

        // Enviar a mensagem para todos os clientes na mesma sala
        io.to(room).emit('message', msg);
        console.log(`Mensagem enviada para a sala ${room}: ${JSON.stringify(msg)}`);
    });

    // Quando um cliente se desconecta
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        delete clients[socket.id];
    });
});

// Função para enviar mensagem manualmente do servidor para uma sala específica
const sendServerMessageToRoom = (room, message) => {
    const serverMessage = {
        id: 'server',
        name: 'Servidor',
        message: message,
        timestamp: new Date().toLocaleTimeString(),
    };
    if (chatRooms[room]) {
        chatRooms[room].push(serverMessage);
    } else {
        chatRooms[room] = [serverMessage];
    }
    io.to(room).emit('message', serverMessage);
};

// Exemplo de como enviar uma mensagem manual do servidor para uma sala específica
// sendServerMessageToRoom('Room1', 'Esta é uma mensagem manual do servidor para a Sala 1');

const getIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

const IP_ADDRESS = getIPAddress();

server.listen(PORT, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
});
