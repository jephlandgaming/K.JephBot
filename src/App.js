import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    {
      sender: "JephBot",
      text: "Hello! I am JephBot, created by King Jeph from Jephland. 😎",
    },
  ]);
  const [input, setInput] = useState("");

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const fetchWikipedia = async (query) => {
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`;
      const res = await axios.get(url);
      return res.data.extract || "I couldn’t find anything on that topic.";
    } catch (err) {
      return "I couldn’t fetch data from Wikipedia right now.";
    }
  };

  const solveMath = (expression) => {
    try {
      // safe eval for basic math
      // eslint-disable-next-line no-eval
      const result = eval(expression);
      return `Answer: ${result}`;
    } catch {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: "You", text: userMsg }]);
    setInput("");

    await delay(1000); // 1 second delay for realism

    // Check if math
    const mathAnswer = solveMath(userMsg);
    let botReply;
    if (mathAnswer) {
      botReply = mathAnswer;
    } else {
      // Use Wikipedia
      botReply = await fetchWikipedia(userMsg);
    }

    setMessages((prev) => [...prev, { sender: "JephBot", text: botReply }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-container">
      <h1>JephBot Chat</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`bubble ${msg.sender === "You" ? "user" : "bot"}`}
          >
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
