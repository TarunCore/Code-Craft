import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../constants';
import HomeImg from "../assets/landing.png"
import "../style.css"
import { useSetRecoilState } from 'recoil';
import { userState } from '../atoms/user';
const Home = () => {
    const [roomId, setRoomId] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [usernameJoin, setUsernameJoin] = useState<string>("");
    const [genRoomId, setGenRoomId] = useState<string|null>(null);
    const setUserState = useSetRecoilState(userState);
    const navigate=useNavigate();
    const handleCreate = async()=>{
        try{
            const resp = await axios.post(`${BASE_URL}/room/create`,{
                username
            })
            if(resp.data.roomId){
                setGenRoomId(resp.data.roomId)
                // navigate("/room/"+resp.data.roomId)
            }
        }catch(err){
            alert("Error in creating room")
            console.log("Error in creating room");
        }
    }
    const handleJoin = async()=>{
        try{
            const resp = await axios.post(`${BASE_URL}/room/join`,{
                roomId,
                username:usernameJoin
            })
            if(resp.data.roomId){
                setUserState(resp.data.roomId)
                navigate("/room/"+resp.data.roomId)
            }
        }catch{
            console.log("Error in joining room mostly room not found");
        }
    }
  return (
    <header className='flex w-[100%] min-h-[90vh] items-center bg-[#242424]'>
        <div className='lg:w-[65%]'>
            <img src={HomeImg} className='w-[60%] ml-12 hidden lg:inline-block' alt="" />
        </div>
        <div className='m-7'>
            <p className='font-poppins text-3xl text-white'>Realtime collaborative Code Editor</p>
            <p className='font-poppins text-2xl text-gray-300'>Sync code across devices</p>
            <br />
            <div>
                <p className='text-xl text-white'>Join a existing room</p>
                <input className='basicInput' type="text" placeholder='Enter room ID' onChange={(e)=>{
                    setRoomId(e.target.value);
                }}/>
                <br />
                <input className='basicInput' type="text" placeholder='Enter your name' onChange={(e)=>{
                    setUsernameJoin(e.target.value);
                }}/>
                <button className='bg-blue-500 p-2 text-white hover:bg-blue-700 rounded' onClick={handleJoin}>Join</button>
                
            </div>
            <br />
            <p className='text-xl text-white'>Create a new room</p>
            <div>
                <input className='basicInput' type="text" placeholder='Enter your name' onChange={(e)=>{
                    setUsername(e.target.value);
                }}/>
                <button className='bg-blue-500 p-2 text-white hover:bg-blue-700 rounded' onClick={handleCreate}>Create</button>
                
            </div>
            {genRoomId && <p className='text-white'>{"Room id: "+genRoomId}</p>}
        </div>
    </header>
  )
}

export default Home 