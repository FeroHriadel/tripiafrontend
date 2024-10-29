import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useToast } from "./toastContext";
import { getIdToken } from "@/utils/cognito";



/*************************************************************************************************************************************
 - messages wsApi expects:
    {action: 'postGet', groupId: string}
    {action: 'postCreate', post: {postedBy: string, body: string, images: string[], groupId: string}
    {action: 'postDelete', postId: string, groupId: string}

 - messages ui expects:
    {action: 'posts', posts: {id: string, postedBy: string, body: string, images: string[], groupId: string, createdAt: string}[] }
    {action: 'postCreate', post: {id: string, postedBy: string, body: string, images: string[], groupId: string, createdAt: string}
    {action: 'postDelete', postId: string
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


const fiveMinutes = 1000 * 60 * 5;

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
  const pingInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  
  function sendQueuedMessages() {
    while (messageQueue.current.length > 0) {
      const queuedMessage = messageQueue.current.shift();
      ws.current?.send(JSON.stringify(queuedMessage));
    }
  }

  function clearWS() {
    if (ws.current) ws.current.close();
    setIsConnected(false);
    ws.current = null;
  }

  async function connect(groupId: string) {
    if (!groupId) return console.log("No groupId provided");
    if (ws.current) return console.log("WS already connected or connecting");
    const idToken = await getIdToken(); if (!idToken) return console.log("No idToken for WS connection");
    ws.current = new WebSocket(`${wsEndpoint}?groupId=${groupId}&token=${idToken}`);
    
    ws.current.onopen = () => {
      setIsConnected(true);
      sendQueuedMessages();
    };

    ws.current.onclose = () => {
      clearWS()
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      showToast("Failed to connect to the Group");
      clearWS();
    };

    ws.current.onmessage = (msg) => {
      handleIncomingMessage(msg);
    };
  }

  function disconnect() {
    clearWS();
  }

  function handleIncomingMessage(msg: MessageEvent) {
    if (message.action === 'Pong') return;
    setMessage(JSON.parse(msg.data));
  }

  function sendMessage(props: { action: string; data: any }) {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) { ws.current.send(JSON.stringify(props)); } 
    else { messageQueue.current.push(props); }
  }


  useEffect(() => { //keep connection alive (I think it expires after 10 min of no activity)
    if (isConnected) {
      clearInterval(pingInterval.current!);
      pingInterval.current = setInterval(() => { ws.current?.send(JSON.stringify({ action: 'ping' })); }, fiveMinutes);
    } else {
      clearInterval(pingInterval.current!);
      pingInterval.current = null;
    }
    return () => { clearInterval(pingInterval.current!); pingInterval.current = null; };
  }, [isConnected]);


  return (
    <WSContext.Provider value={{ isConnected, connect, disconnect, sendMessage, message }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS: any = () => useContext(WSContext);
