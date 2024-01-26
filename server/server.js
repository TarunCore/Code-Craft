import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { IoManager } from './Managers/IoManager.js';
import { MongoManager } from './Managers/MongoManager.js';
import { appRouter } from './user/user.js';
const app = express()
app.use(cors())
app.use(express.json())
app.get("/",(req, res)=>{
    res.send("Server running")
})
app.use("/",appRouter)
const httpServer = createServer(app);
const httpServer2 = createServer(app);
const sockserver = new WebSocketServer({ server: httpServer })
sockserver.on('connection', ws => {
    console.log('New client connected!')
    ws.on('close', () => console.log('Client has disconnected!'))
    ws.onerror = function () {
        console.log('websocket error')
    }
})
export const iomanage = new IoManager(httpServer2);
export const mongoManager = new MongoManager();
httpServer.listen(1234, ()=>{
    mongoManager.connect().catch(err => console.log(err));
    console.log("http://localhost:1234")
})
httpServer2.listen(3000, ()=>{
    console.log("http://localhost:3000")
})