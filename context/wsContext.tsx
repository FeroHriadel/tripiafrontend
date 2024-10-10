import { createContext, useContext, useState, useRef } from "react";



interface WSContextState {
  isConnected: boolean;
  connect: (groupId: string) => void;
  disconnect: () => void;
}

interface WSContextProviderProps {
  children: React.ReactNode;
}



const wsEndpoint = process.env.NEXT_PUBLIC_WS_ENDPOINT!;

const WSContext = createContext<WSContextState>({
  isConnected: false,
  connect: (groupId) => {},
  disconnect: () => {},
});



export const WSContextProvider: React.FC<WSContextProviderProps> = ({ children }: {children: React.ReactNode}) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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
  }

  return (
    <WSContext.Provider value={{ isConnected, connect, disconnect }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS: any = () => useContext(WSContext);
