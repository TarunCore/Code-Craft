import React, { Children, createContext } from 'react'
import {Socket, io} from "socket.io-client"
import { BASE_WS_URL } from '../constants';

const socket = io(BASE_WS_URL);
export const SocketContext = createContext<Socket>({} as unknown as Socket );
export const SocketContextProvider = ({children}: {children: React.ReactNode}) => {
  return <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
}
