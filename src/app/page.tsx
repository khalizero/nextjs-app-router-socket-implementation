"use client";

import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSearchParams } from "next/navigation";

let socket: any;

type Message = {
  userId: string;
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const searchParams = useSearchParams();
  const roomId = searchParams?.get("roomId");
  const userId = searchParams?.get("userId");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!roomId || !userId) return;
  
    // Load history
    fetch(`/api/messages?roomId=${roomId}`)
      .then(res => res.json())
      .then(data => setMessages(data));
  
    // Now connect to socket
    socket = io('http://localhost:8000', {
      path: '/api/socket/io',
      query: { roomId, userId },
    });
  
    socket.on('message', (data: any) => {
      setMessages(prev => [...prev, data]);
    });
  
    return () => socket.disconnect();
  }, [roomId, userId]);
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input); // server will broadcast it back
      setInput("");
    }
  };

  return (
    <div className="flex flex-col mx-auto p-6 max-w-2xl h-screen">
      <h1 className="mb-4 font-bold text-2xl">Room {roomId}</h1>

      <div className="flex-1 space-y-2 bg-gray-100 mb-4 p-4 rounded overflow-y-auto">
        {messages.map((msg, idx) => {
          const isSelf = msg.userId === userId;
          return (
            <div
              key={idx}
              className={`flex flex-col ${
                isSelf ? "items-end" : "items-start"
              }`}
            >
              <div className="mb-1 text-gray-500 text-xs">
                {isSelf ? "You" : `${msg.userId}`}
              </div>
              <div
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                  isSelf
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded text-white"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
