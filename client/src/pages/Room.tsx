import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import "../style.css"
// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:1234';
const socket = io(URL); 
const Room = () => {
    const {id} = useParams<string>();
    const [messages, setMessages] = useState<Array<string>>([]);
    const [msgTyped, setMsgTyped] = useState("");
    const handleSend = ()=>{
        socket.emit("send message", id, msgTyped)
    }
    useEffect(()=>{
        socket.emit("join-room", id);
    },[])

    useEffect(()=>{
        socket.on("receive message", (msg) => {
                console.log(messages);
                
                setMessages(prevMessages => [...prevMessages, msg]);
        });
        return () => {
            socket.off('receive message');
        };
    }, [])
  return (
    <div className='flex w-[100%] h-[70vh]'>
        <div className='chats  max-w-[20%] h-full flex-grow'>
                <div className='flex flex-col justify-between h-full  bg-slate-600'>
                    <div className='overflow-y-scroll text-white no-scrollbar'>
                    {messages.map((msg, ind)=>{
                        return <p key={msg+ind}>{ind + " " +msg}</p>
                    })}
                    </div>
                    <div className='m-1 self-center'>
                    <input type="text" placeholder='type message' className='rounded-sm' onChange={(e)=>{
                        setMsgTyped(e.target.value)
                    }}/>
                    <button onClick={handleSend} className='text-white bg-purple-600'>Send</button>
                    </div>
                </div>
        </div>
    </div>

    
  )
}

export default Room