import { io } from 'socket.io-client';

const URL = 'http://localhost:8000';  // Certifique-se de que a URL esteja correta
const socket = io(URL, {
    autoConnect: false,  // Você pode usar autoConnect: true para conectar automaticamente
});

const ip = '10.26.12.100'  // Deve ser o Ip da máquina 

const SERVER_URL = `http://${ip}:8000`;  // Deve ser o Ip da máquina que está rodando o servidor + port 8000

const socket: Socket = io(SERVER_URL);

export default socket;