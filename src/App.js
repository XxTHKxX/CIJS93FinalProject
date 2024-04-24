import React, { useState } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle sending messages
  const sendMessage = async () => {
    const messageContent = input.trim();
    if (!messageContent) return;

    // Display the user's message on the chat interface
    setMessages(prevMessages => [...prevMessages, { text: messageContent, sender: 'user' }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://213.35.108.112:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: messageContent })
      });

      const data = await response.json();

      // Display the API's response on the chat interface
      setMessages(prevMessages => [...prevMessages, { text: data.reply, sender: 'api' }]);
    } catch (error) {
      setError('Failed to send message');
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
      <div className="App">
        <div className="chat-container">
          <header className="chat-header">
            ChatBot Interface
          </header>
          {loading && <BeatLoader color={"#123abc"} loading={loading} size={15} />}
          {error && <div>{error}</div>}
          <ul className="chat-messages">
            {messages.map((msg, index) => (
                <li key={index} className={`message ${msg.sender === 'user' ? 'user' : 'api'}`}>
                  {msg.text}
                </li>
            ))}
          </ul>
          <div className="chat-input">
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      </div>
  );
}

export default App;