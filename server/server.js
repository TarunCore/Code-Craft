import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { IoManager } from './Managers/IoManager.js';
import { MongoManager } from './Managers/MongoManager.js';
import { appRouter } from './user/user.js';
import {setupWSConnection} from 'y-websocket/bin/utils';
const app = express()
app.use(cors(
    {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type",
      credentials: true
    }
  ))
app.use(express.json())
app.get("/",(req, res)=>{
    res.send("Server running")
})
app.use("/",appRouter)
const httpServer = createServer(app);
const httpServer2 = createServer(app);
const sockserver = new WebSocketServer({ server: httpServer })
sockserver.on('connection', (ws, req) => {
    setupWSConnection(ws, req);
    console.log('New client connected!')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.onerror = function () {
        console.log('websocket error')
    }
})
export const iomanage = new IoManager(httpServer);
export const mongoManager = new MongoManager();
httpServer.listen(3000, ()=>{
    mongoManager.disconnect();
    mongoManager.connect().catch(err => console.log(err));
    console.log("http://localhost:3000")
})
// httpServer2.listen(3001, ()=>{
//     console.log("http://localhost:3001")
// })