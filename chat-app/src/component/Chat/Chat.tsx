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
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        socket.on('message', (msg: Message) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: socket.id ?? '',
                name: 'Você',
                message: message,
                time: new Date().toLocaleTimeString(),
            };
            socket.emit('message', newMessage);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">Chat</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
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
