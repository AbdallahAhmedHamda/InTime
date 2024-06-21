// src/Chat.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);

  console.log(messages)

  // Function to get token (this can be from localStorage, a cookie, or any other method)
  const getToken = () => {
    const accessToken = localStorage.getItem('accessToken')
    return accessToken; // Replace with your method to get the token
  };

  console.log(socket)

  useEffect(() => {
    // Initialize socket connection
    const token = getToken();
    const newSocket = io('https://intime-9hga.onrender.com/', {
      extraHeaders: {
        accesstoken: token
      }
    });

    setSocket(newSocket);

    // Handle connection
    newSocket.on('connect', () => {
      console.log('Connected to server');
      // Example of joining a project chat
      const projectId = 'exampleProjectId'; // Replace with actual project ID
      newSocket.emit('joinProjectChat', { projectId: '666f98c51116a0c7809d687d' });

      // Load old messages
      newSocket.on('loadOldMessages', (messages) => {
        setMessages(messages);
      });
    });

    // Handle incoming chat messages
    newSocket.on('chatMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Handle errors
    newSocket.on('error', (error) => {
      console.error('Error:', error);
    });

    // Cleanup on unmount
    return () => newSocket.close();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message) {
      const projectId = '666f98c51116a0c7809d687d'; // Replace with actual project ID
      socket.emit('message', { message, projectId });
      setMessage('');
    }
  };

  return (
    <div>
      <ul id="messages">
        {messages.map((msg, index) => (
          <li key={index}>{`${msg.user.name}: ${msg.message}`}</li>
        ))}
      </ul>
      <form id="form" onSubmit={handleSubmit}>
        <input
          id="input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete="off"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;