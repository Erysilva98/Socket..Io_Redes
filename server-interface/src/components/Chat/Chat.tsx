import React, { useEffect, useState } from 'react';
import socket from '../../socket';
import './Chat.css'; // Importando o CSS

const Chat: React.FC = () => {
    const [room, setRoom] = useState('Room 1');
    const [messages, setMessages] = useState<{ name: string; message: string; timestamp: string }[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Conectar e entrar na sala atual
        socket.connect();
        socket.emit('join room', room);

        // Receber o histórico de mensagens da sala
        socket.on('chat history', (history) => {
            setMessages(history);
        });

        // Receber novas mensagens e adicioná-las à lista
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Desconectar ao sair da sala
        return () => {
            socket.off('chat history');
            socket.off('message');
            socket.emit('leave room', room); // O cliente deixa a sala
            socket.disconnect();
        };
    }, [room]); // Executa o efeito sempre que a sala muda

    const sendMessage = () => {
        if (input) {
            const messageData = {
                room: room, // Certifica-se de que a sala está correta
                message: input,
                name: 'Você', // Nome do remetente
            };
            socket.emit('message', messageData);
            setInput(''); // Limpar o campo de entrada após enviar a mensagem
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-sidebar">
                <h2>Salas de Chat</h2>
                <ul>
                    <li className={room === 'Sala 1' ? 'active' : ''} onClick={() => setRoom('Sala 1')}>
                        Sala 1
                    </li>
                    <li className={room === 'Sala 2' ? 'active' : ''} onClick={() => setRoom('Sala 2')}>
                        Sala 2
                    </li>
                    <li className={room === 'Sala 3' ? 'active' : ''} onClick={() => setRoom('Sala 3')}>
                        Sala 3
                    </li>
                </ul>
            </div>
            <div className="chat-main">
                <div className="chat-header">Chat: {room}</div>
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
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Enviar ao pressionar Enter
                        placeholder="Escreva sua mensagem..."
                    />
                    <button onClick={sendMessage}>Enviar</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;