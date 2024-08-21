import { io, Socket } from 'socket.io-client';

const ip = '10.26.12.100'  // Deve ser o Ip da máquina 

const SERVER_URL = `http://${ip}:8000`;  // Deve ser o Ip da máquina que está rodando o servidor + port 8000

// Configurações adicionais para o socket
const socketOptions = {
    reconnectionAttempts: 10, // Tentativas de reconexão antes de desistir
    reconnectionDelay: 60, // Delay entre as tentativas de reconexão
    transports: ['websocket'], // Usar websocket como transporte principal
};

const socket: Socket = io(SERVER_URL, socketOptions);

export default socket;
