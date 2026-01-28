// src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";

export function useWebSocket() {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => ws.current.close();
  }, []);

  const send = (data) => {
    ws.current?.send(JSON.stringify(data));
  };

  return { messages, send };
}
