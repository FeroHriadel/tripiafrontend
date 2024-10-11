import { createContext, useContext, useState, useRef } from "react";



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
  sendMessage: (props: {action: string, data: any}) => void;
  message: {[key: string]: any};
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



export const WSContextProvider: React.FC<WSContextProviderProps> = ({ children }: {children: React.ReactNode}) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState<{[key: string]: any}>({});

  function connect(groupId: string) {
    if (!groupId) return console.log('No groupId provided');
    if (ws.current) return console.log('WS already connected or connecting');
    ws.current = new WebSocket(`${wsEndpoint}?groupId=${groupId}`);
    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };
    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false); 
      ws.current = null;
    };
    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      setIsConnected(false);
      ws.current = null;
    };
    ws.current.onmessage = (msg) => {
      handleIncomingMessage(msg);
    };
  }

  function disconnect() {
    if (!ws.current) return console.log('WS already disconnected');
    ws.current.close();
    ws.current = null;
    console.log('WS disconnected');
    setIsConnected(false);
  }

  function handleIncomingMessage(msg: MessageEvent) {
    console.log('Message received:', msg.data);
    setMessage(JSON.parse(msg.data));
  }

  function sendMessage(props: {action: string, data: any}) {
    if (!isConnected) return console.log(`WS not connected, can't send message`);
    ws.current?.send(JSON.stringify(props));
  }

  return (
    <WSContext.Provider value={{ isConnected, connect, disconnect, sendMessage, message }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS: any = () => useContext(WSContext);
