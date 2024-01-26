import {Schema, model} from "mongoose";


const roomSchema = new Schema({
    roomId: String,
    admin: String,
    participants: [{type: String, default: []}],
    // files: [{type: String, default: ["hi.txt"]}]
    files:[{type:{filename: String, fileType: String, content:String}, default:[]}]
})


export const Room = model("Rooms", roomSchema);