import {Server, Socket} from "socket.io"

export class IoManager{
    io;
    roomppl;
    constructor(httpServer){
        console.log('from iomanager');
        this.roomppl={};
        this.io=new Server(httpServer,{
            cors:{
                origin:"*"
            }
        });
        this.io.on("connection",(socket)=>{
            socket.on("file_add", (roomId, filename)=>{
                this.io.emit("file_add", roomId, filename)
            })
            socket.on("disconnect",(reason)=>{
                // when window is closed and not for disconnect button
                // create a new event for disconnect button and emit the event to server
            })
        })
    }
    joinRoomEmit(roomId, username){
        console.log('from iomanager');
        if(this.roomppl[roomId]){
            this.roomppl[roomId].push(username);
        }else{
            this.roomppl[roomId]=[username]
        }
        this.io.emit("participant_join", roomId, username, this.roomppl[roomId]);
    }
    getParticipants(roomId){
        return this.roomppl[roomId];
    }
    addFileEmit(roomId){
        // this.io.emit("file_add", roomId)

        // socket is emitting from client side. SO HERE NO need
    }
    getIo(){
        return this.io;
    }

}