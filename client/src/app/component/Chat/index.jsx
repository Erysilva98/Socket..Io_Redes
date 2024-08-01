import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socketUrl = process.env.REACT_APP_SOCKET_URL;
const apiUrl = process.env.REACT_APP_API_URL;

const socket = io(socketUrl);

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        axios.get(`${apiUrl}/messages`)
            .then(response => {
                setMessages(response.data);
            });

        socket.on('message', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit('message', input);
            setInput('');
        }
    };

    return (
        <section className="chat-container">
            <header>
                <h2>Chat</h2>
            </header>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg}
                    </div>
                ))}
            </div>
            <footer className="input-container">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </footer>
        </section>
    );
};

export default Chat;
