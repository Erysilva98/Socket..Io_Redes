import React, { useState, useEffect } from 'react';
import socket from '../../socket';
import './Chat.css';

interface Message {
    id: string;
    name: string;
    message: string;
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
            };
            socket.emit('message', newMessage);
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">Servidor</div>
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.id === socket.id ? 'sent' : 'received'}`}>
                        <div className="message-content">
                            <strong>{msg.name}: </strong> {msg.message}
                        </div>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Digite sua mensagem..."
                />
                <button onClick={sendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default Chat;
