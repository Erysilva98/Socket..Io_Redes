import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Chat.css';

interface Message {
    id: string;
    name: string;
    message: string;
    time: string;
}

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<{ [key: string]: Message[] }>({}); // Armazena mensagens por sala
    const [room, setRoom] = useState<string>('Room 1'); // Sala atual

    useEffect(() => {
        // Entrar na sala quando o componente for montado ou quando a sala mudar
        socket.emit('join room', room);

        // Receber o histórico de mensagens da sala
        socket.on('chat history', (history: Message[]) => {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [room]: history
            }));
        });

        // Receber novas mensagens
        socket.on('message', (msg: Message) => {
            setMessages((prevMessages) => ({
                ...prevMessages,
                [room]: [...(prevMessages[room] || []), msg]
            }));
        });

        // Limpar quando o componente for desmontado ou a sala mudar
        return () => {
            socket.emit('leave room', room); // Sair da sala
            socket.off('chat history');
            socket.off('message');
        };
    }, [room]); // Efeito depende da sala

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: socket.id ?? '',
                name: 'Você',
                message: message,
                time: new Date().toLocaleTimeString(),
            };
            socket.emit('message', { ...newMessage, room }); // Enviar mensagem para a sala específica
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <select value={room} onChange={(e) => setRoom(e.target.value)}>
                    <option value="Sala 1">Sala 1</option>
                    <option value="Sala 2">Sala 2</option>
                    <option value="Sala 3">Sala 3</option>
                </select>
                <span>Chat - {room}</span>
            </div>
            <div className="chat-messages">
                {(messages[room] || []).map((msg, index) => (
                    <div key={index} className={`message ${msg.id === socket.id ? 'sent' : 'received'}`}>
                        <div className="message-content">
                            <div className="avatar">
                                <FontAwesomeIcon icon={faUser} size="2x" />
                            </div>
                            <div className="message-text">
                                <p>{msg.message}</p>
                                <span className="message-time">{msg.time}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Escreva sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
