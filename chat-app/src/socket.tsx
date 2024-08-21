import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://10.26.12.118:8000';  // Deve ser o IP da máquina que está rodando o servidor + porta 8000

// Configurações adicionais para o socket
const socketOptions = {
    reconnectionAttempts: 5, // Tentativas de reconexão antes de desistir
    reconnectionDelay: 1000, // Delay entre as tentativas de reconexão
    transports: ['websocket'], // Usar websocket como transporte principal
};

const socket: Socket = io(SERVER_URL, socketOptions);

export default socket;
