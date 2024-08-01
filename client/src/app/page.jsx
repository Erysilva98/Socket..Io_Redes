'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const apiUrl = process.env.REACT_APP_API_URL;
const socketUrl = process.env.REACT_APP_SOCKET_URL;
const socket = io(socketUrl);

const Home = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/clients`)
      .then(response => {
        setClients(response.data);
        if (response.data.length > 0) {
          setSelectedClient(response.data[0]);
        }
      });
  }, []);

  useEffect(() => {
    axios.get(`${apiUrl}/messages`)
      .then(response => {
        setMessages(response.data);
      });

    socket.on('message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const selectClient = (client) => {
    setSelectedClient(client);
  };

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <div className="container mx-auto p-4 h-screen">
      <main className="flex h-full">
        <aside className="w-1/3 bg-white border-r border-gray-300 p-4 overflow-y-auto">
          <header>
            <h2 className="font-bold text-lg mb-4">Recent</h2>
          </header>
          <ul>
            {clients.map((client, index) => (
              <li
                key={index}
                onClick={() => selectClient(client)}
                className={`py-4 px-2 cursor-pointer hover:bg-gray-100 ${selectedClient === client ? 'bg-blue-100' : ''}`}
              >
                <div className="flex items-center">
                  <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full mr-3" />
                  <div>
                    <div className="font-bold">{client.name}</div>
                    <div className="text-gray-500 text-sm">{client.message}</div>
                  </div>
                  <div className="ml-auto text-gray-400 text-xs">{client.date}</div>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {selectedClient && (
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
        )}
      </main>
    </div>
  );
};

export default Home;
