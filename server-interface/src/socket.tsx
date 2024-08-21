import { io } from 'socket.io-client';

const URL = 'http://localhost:8000';  // Certifique-se de que a URL esteja correta
const socket = io(URL, {
    autoConnect: false,  // Você pode usar autoConnect: true para conectar automaticamente
});

export default socket;