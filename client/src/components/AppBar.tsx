import React from 'react'
import "../style.css"
import { useNavigate } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState } from '../atoms/user';
const AppBar = () => {
  const navigate = useNavigate();
  const [user, setUserState] = useRecoilState(userState);
  const handleDisconnect = ()=>{
    setUserState(null);
  }
  return (
    <div className='flex justify-between h-[10vh] p-4 bg-[#242424]'>
        <div>
            <h1 className='text-white text-3xl font-poppins' onClick={()=>{
              navigate("/")
            }}>Code Craft</h1>
        </div>
        <div>
            {user && <button className='bg-blue-500 p-2 text-white hover:bg-blue-700 rounded' onClick={handleDisconnect}>Disconnect</button>}
        </div>
    </div>
  )
}

export default AppBar