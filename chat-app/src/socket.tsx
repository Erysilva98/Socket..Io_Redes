import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'http://127.0.0.1:8000';

const socket: Socket = io(SERVER_URL);

export default socket;
