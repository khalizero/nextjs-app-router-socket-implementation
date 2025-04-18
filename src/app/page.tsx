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
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const roomId = searchParams?.get("roomId");
  const userId = searchParams?.get("userId");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!roomId || !userId) return;
    // Set loading to true before fetching
    setLoading(true);

    // Load history
    fetch(`/api/messages?roomId=${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false); // Set loading to false after fetching
      });

    // Now connect to socket
    socket = io(`${process.env.NEXT_PUBLIC_SOCKER_BASE_URL}:${process.env.NEXT_PUBLIC_SOCKET_PORT}`, {
      path: "/api/socket/io",
      query: { roomId, userId },
    });

    socket.on("message", (data: any) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("typing", (data: { userId: string }) => {
      if (data.userId !== userId) {
        setTypingUsers((prev) =>
          prev.includes(data.userId) ? prev : [...prev, data.userId]
        );
      }
    });

    socket.on("stopTyping", (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== data.userId));
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
      socket.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input); // Send message
      socket.emit("stopTyping", { roomId, userId }); // 💡 Tell others you stopped typing
      setInput("");
    }
  };
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) {
      socket.emit("typing", { roomId, userId });
    } else {
      socket.emit("stopTyping", { roomId, userId });
    }
  };

  return (
    <div className="flex flex-col mx-auto p-6 max-w-2xl h-screen">
      <h1 className="mb-4 font-bold text-2xl">Room {roomId}</h1>

      <div className="flex-1 space-y-2 bg-gray-100 mb-4 p-4 rounded overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div
              className="spinner-border text-purple-500 animate-spin"
              role="status"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {typingUsers.length > 0 && (
        <div className="mb-1 text-gray-500 text-sm">
          {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"}{" "}
          typing...
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
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
