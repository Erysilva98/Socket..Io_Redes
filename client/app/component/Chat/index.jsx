import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socketUrl = process.env.REACT_APP_SOCKET_URL;
const apiUrl = process.env.REACT_APP_API_URL;

const socket = io(socketUrl);

const Chat = ({ messages, input, setInput, sendMessage }) => {
    return (
        <section className="flex-1 flex flex-col bg-white">
            <header className="bg-blue-500 text-white p-4">
                <h2>Chat</h2>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`mb-4 p-2 rounded ${msg.sender === 'me' ? 'bg-blue-500 text-white self-end' : 'bg-gray-200'}`}>
                        {msg.text}
                        <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                    </div>
                ))}
            </div>
            <footer className="p-4 bg-gray-100 flex border-t border-gray-300">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    className="flex-grow p-2 border border-gray-300 rounded mr-2"
                />
                <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Send</button>
            </footer>
        </section>
    );
};

export default Chat;
