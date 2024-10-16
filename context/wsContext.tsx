import { createContext, useContext, useState, useRef } from "react";
import { useToast } from "./toastContext";
import { getIdToken } from "@/utils/cognito";

/*************************************************************************************************************************************
 - messages wsApi expects:
    {action: 'postGet', groupId: string}
    {action: 'postCreate', post: {postedBy: string, body: string, images: string[], groupId: string}
    {action: 'postDelete', postId: string, groupId: string}

 - messages ui expects:
    {action: 'posts', posts: {id: string, postedBy: string, body: string, images: string[], groupId: string, createdAt: string}[] }
    {action: 'postCreated', post: {id: string, postedBy: string, body: string, images: string[], groupId: string, createdAt: string}
    {action: 'postDeleted', postId: string
**************************************************************************************************************************************/

interface WSContextState {
  isConnected: boolean;
  connect: (groupId: string) => void;
  disconnect: () => void;
  sendMessage: (props: { action: string; data: any }) => void;
  message: { [key: string]: any };
}

interface WSContextProviderProps {
  children: React.ReactNode;
}

const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT!;

const WSContext = createContext<WSContextState>({
  isConnected: false,
  connect: (groupId) => {},
  disconnect: () => {},
  sendMessage: (props) => {},
  message: {},
});

export const WSContextProvider: React.FC<WSContextProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ws = useRef<WebSocket | null>(null);
  const messageQueue = useRef<{ action: string; data: any }[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<{ [key: string]: any }>({});
  const { showToast } = useToast();


  function sendQueuedMessages() {
    while (messageQueue.current.length > 0) { 
      const msg = messageQueue.current.shift();
      if (msg) { sendMessageImmediately(msg); }
    }
  }

  async function connect(groupId: string) {
    if (!groupId) return console.log("No groupId provided");
    if (ws.current) return console.log("WS already connected or connecting");
    const idToken = await getIdToken(); if (!idToken) return console.log("No idToken for WS connection");
    ws.current = new WebSocket(`${wsEndpoint}?groupId=${groupId}&token=${idToken}`);
    
    ws.current.onopen = () => {
      console.log("WebSocket connected");
      console.log(`Current WebSocket state: ${ws.current?.readyState}`);
      setIsConnected(true);
      sendQueuedMessages();
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      ws.current = null;
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      showToast("Failed to connect to the Group");
      setIsConnected(false);
      ws.current = null;
    };

    ws.current.onmessage = (msg) => {
      handleIncomingMessage(msg);
    };
  }

  function disconnect() {
    if (!ws.current) return console.log("WS already disconnected");
    ws.current.close();
    ws.current = null;
    console.log("WS disconnected");
    setIsConnected(false);
  }

  function handleIncomingMessage(msg: MessageEvent) {
    setMessage(JSON.parse(msg.data));
  }

  function sendMessage(props: { action: string; data: any }) {
    if (!isConnected) {
      messageQueue.current.push(props);
    } 
    else {
      if (ws.current?.readyState === WebSocket.OPEN) sendMessageImmediately(props)
      else messageQueue.current.push(props);
    }
  }

  function sendMessageImmediately(props: { action: string; data: any }) {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) ws.current.send(JSON.stringify(props));
    else showToast("Failed to send message - WS not connected yet");	
  }


  return (
    <WSContext.Provider value={{ isConnected, connect, disconnect, sendMessage, message }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS: any = () => useContext(WSContext);
