import { io } from 'socket.io-client';

const URL = 'http://localhost:8000'; // Altere para o endereço do seu servidor
const socket = io(URL, {
    autoConnect: false,
});

export default socket;
