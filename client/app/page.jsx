'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Chat from './component/Chat';
import Menu from './component/Menu';

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
        <Menu clients={clients} selectClient={selectClient} selectedClient={selectedClient} />
        {selectedClient && (
          <Chat messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} />
        )}
      </main>
    </div>
  );
};

export default Home;
