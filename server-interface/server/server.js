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
let clients = [];

app.use(cors());

app.get('/clients', (req, res) => {
    res.json(clients);
});

app.get('/messages', (req, res) => {
    res.json([]);
});

io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    clients.push({ id: socket.id, name: `Client ${clients.length + 1}`, message: '' });

    // Quando uma mensagem é recebida de um cliente
    socket.on('message', (msg) => {
        console.log(`Mensagem recebida de ${socket.id}: ${JSON.stringify(msg)}`);

        // Enviar a mensagem para todos os clientes conectados
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        clients = clients.filter((client) => client.id !== socket.id);
    });
});

// Função para enviar mensagem manualmente do servidor
const sendServerMessage = (message) => {
    const serverMessage = {
        id: 'server',
        name: 'Servidor',
        message: message
    };
    io.emit('message', serverMessage);
};

// Exemplo de como enviar uma mensagem manual do servidor
// sendServerMessage('Esta é uma mensagem manual do servidor');

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
