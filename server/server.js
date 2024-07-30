const http = require('http');
const app = require('./src/app');
const { initSockets } = require('./src/sockets/chatSocket');

const server = http.createServer(app);
const io = require('socket.io')(server);

// Inicializa os sockets
initSockets(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
