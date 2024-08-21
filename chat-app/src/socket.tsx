import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://10.26.12.118:8000';  // Deve ser o Ip da máquina que está rodando o servidor + port 8000

const socket: Socket = io(SERVER_URL);

export default socket;
