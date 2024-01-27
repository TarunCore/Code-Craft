import {Room} from "../db/roomSchema.js";
import mongoose from "mongoose";

export class MongoManager{
    Room;
    constructor(){
        this.Room=Room;
    }

    async connect(){
        await mongoose.connect('mongodb://127.0.0.1:27017/Code', { dbName: "Code-Data" });
        // mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.random.mongodb.net/`, { dbName: "Code-Data" });
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
            // let content="";
            // console.log(room.files[11].content);
            for(var i=0;i<room.files.length;i++){
                if(room.files[i].filename===fileName){
                    // console.log('wow');
                    console.log("hey "+room.files[i].content);
                    
                    return room.files[i].content;
                }
                // console.log("hey "+room.files[i].content);
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