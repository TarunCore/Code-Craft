import {Room} from "../db/roomSchema.js";
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export class MongoManager{
    Room;
    constructor(){
        this.Room=Room;
    }

    async connect(){
        // await mongoose.connect('mongodb://127.0.0.1:27017/Code', { dbName: "Code-Data" });
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.${process.env.DB_ID}.mongodb.net/`, { dbName: "Code-Craft" });
    }
    async disconnect(){
        await mongoose.disconnect();
    }
    async createRoom(admin, roomId){
        const newRoom=new this.Room({
            admin,
            roomId,
            participants: [admin],
            files:[{
                filename:"sample.js",
                fileType:"js",
                content:"",
            }]
        })
        await newRoom.save()
        return newRoom;
    }
    async getRoom(roomId){
        return await this.Room.findOne({roomId})
    }
    async addFile(roomId, filename){
        const fileType = filename.split(".")[1];
        const prev = await this.Room.findOne({roomId});
        if(prev){
            const prevFile = prev.files.find(file=> file.filename==filename);
            if(prevFile){
                return {status: false, msg: "File aldready exists"};
            }
        }
        const fileAddSatus = await this.Room.findOneAndUpdate({roomId:roomId}, {"$push": { "files":  {filename,fileType,content:""} }})
        if(fileAddSatus){
            return {status: true, msg: "File created successfully"};
        }
        return {status: false, msg: "File create error in server"};
    }
    async getFiles(roomId){
        const room = await this.Room.findOne({roomId:roomId})
        if(room){
            return room.files;
        }
        return [];
    }
    async getCode(roomId, fileName){
        const room = await this.Room.findOne({roomId:roomId});
        if(room){
            for(var i=0;i<room.files.length;i++){
                if(room.files[i].filename===fileName){
                    return room.files[i].content;
                }
            }
            
        }
        return null;
    }
    async storeFile(roomId, filenameToUpdate, newContent){
        const updatedRoom = await this.Room.findOneAndUpdate(
            { roomId, 'files.filename': filenameToUpdate },
            { $set: { 'files.$.content': newContent } },
            { new: true }
          );
        return updatedRoom;
    }
}