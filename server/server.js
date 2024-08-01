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

    socket.on('message', (msg) => {
        io.emit('message', msg);
        clients = clients.map((client) => (client.id === socket.id ? { ...client, message: msg } : client));
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        clients = clients.filter((client) => client.id !== socket.id);
    });
});

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
