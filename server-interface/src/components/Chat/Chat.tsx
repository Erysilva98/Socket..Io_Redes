import React, { useEffect, useState } from 'react';
import socket from '../../socket';
import './Chat.css'; // Importando o CSS

const Chat: React.FC = () => {
    const [room, setRoom] = useState('Room 1');
    const [messages, setMessages] = useState<{ name: string; message: string; timestamp: string }[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Conectar ao socket
        socket.connect();

        // Entrar na sala atual
        socket.emit('join room', room);

        // Receber o histórico de mensagens da sala
        socket.on('chat history', (history) => {
            setMessages(history);
        });

        // Receber novas mensagens e adicioná-las à lista
        socket.on('message', (message) => {
            if (message.room === room) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        });

        // Cleanup ao mudar de sala ou desconectar
        return () => {
            socket.emit('leave room', room);  // Sair da sala atual
            socket.off('chat history');
            socket.off('message');
        };
    }, [room]); // Executa o efeito sempre que a sala muda

    const sendMessage = () => {
        if (input) {
            const messageData = {
                room: room, // Certifique-se de que a sala está correta
                message: input,
                name: 'Você', // Nome do remetente
            };
            socket.emit('message', messageData);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Salas de Chat</h2>
                <ul>
                    <li className={room === 'Room 1' ? 'active' : ''} onClick={() => setRoom('Room 1')}>
                        Room 1
                    </li>
                    <li className={room === 'Room 2' ? 'active' : ''} onClick={() => setRoom('Room 2')}>
                        Room 2
                    </li>
                    <li className={room === 'Room 3' ? 'active' : ''} onClick={() => setRoom('Room 3')}>
                        Room 3
                    </li>
                </ul>
            </div>
            <div className="chat-main">
                <div className="chat-header">Chat Room: {room}</div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.name === 'Você' ? 'sent' : 'received'}`}>
                            <div className="message-content">
                                <div className="avatar">{msg.name ? msg.name.charAt(0) : '?'}</div>
                                <div className="message-text">
                                    {msg.message}
                                    <span className="message-time">{msg.timestamp}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
