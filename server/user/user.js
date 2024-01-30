import { Router } from "express";
import { iomanage, mongoManager } from "../server.js";

export const appRouter = Router();

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
  }
appRouter.post("/room/create",async(req, res)=>{
    const {username} = req.body;
    if(username){
        const randomId = generateRandomString(5);
        const createdRoom = await mongoManager.createRoom(username, randomId);
        return res.send(createdRoom)
    }
    res.status(417).json({message: "No valid input"})
})
appRouter.post("/room/join",async(req, res)=>{
    const {roomId, username} = req.body;
    const room = await mongoManager.getRoom(roomId);
    if(room){
        iomanage.joinRoomEmit(roomId, username);
        return res.send(room);
    }
    res.status(400).json({message: "No room found"})
})
appRouter.post("/room/addfile",async(req, res)=>{
    const {roomId, filename} = req.body;
    const statusFile = await mongoManager.addFile(roomId, filename);
    if(statusFile){
        iomanage.addFileEmit(roomId);
        return res.send({status: statusFile.status, msg:statusFile.msg});
    }
    res.status(403).json({msg: "adding file error in server side"})
})
appRouter.post("/room/getfiles",async(req, res)=>{
    const {roomId} = req.body;
    const files = await mongoManager.getFiles(roomId);
    if(files){
        return res.send({files, msg:"success"});
    }
    res.status(403).json({msg: "No room found"})
})
appRouter.post("/room/getcode",async(req, res)=>{
    const {roomId, filename} = req.body;
    const code = await mongoManager.getCode(roomId, filename);
    console.log(code);
    
    if(code!=null){
        return res.send({status:true, code, msg:"success"});
    }
    res.status(403).json({status:false, msg: "No room found"})
})
appRouter.post("/room/getParticipants",(req, res)=>{
    const {roomId} = req.body;
    const participants = iomanage.getParticipants(roomId);
    if(participants){
        return res.send({participants, msg:"success"});
    }
    res.status(400).json({msg: "No room found from getParticipants function"})
})
appRouter.patch("/room/savefile",async(req, res)=>{
    const {roomId, filename, content} = req.body;
    const updatedRoom = await mongoManager.storeFile(roomId, filename, content);
    if(updatedRoom){
        return res.send({status:true,msg:"Storing content success"})
    }
    res.status(400).json({status:false, msg: "Storing content fail",updatedRoom})
})