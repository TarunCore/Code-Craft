import { useContext, useEffect, useRef, useState } from 'react'
import {Editor} from "@monaco-editor/react"
import * as Y from "yjs"
import { editor } from "monaco-editor";
import { WebsocketProvider } from 'y-websocket'
import {MonacoBinding} from "y-monaco"
import { SocketContext } from '../context/SocketContext';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL, LANGUAGE_MAP } from '../constants';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/user';

interface File{
    filename: string,
    fileType: string,
    content: string
}

function CodeSpace() {
    const [language, setLanguage] = useState<string>("javascript");
    const [currentFile, setCurrentFile] = useState<string>("none.txt");
    const [addFileName, setAddFileName] = useState<string>("");

    // const [savedCode, setSavedCode] = useState<string>("void");
    const [participants, setParticipants] = useState<Array<string>>([]);
    const [files, setFiles] = useState<Array<string>>([]);
    const user = useRecoilValue(userState);
    const socket = useContext(SocketContext);
    const {id} = useParams();
    const navigate = useNavigate();
  const editorRef = useRef<editor.IStandaloneCodeEditor>();
  const wsProviderRef = useRef<WebsocketProvider>();
  const handleEditorMount =  (editor:editor.IStandaloneCodeEditor)=>{
    editorRef.current = editor;
    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider('ws://localhost:1234', id!, doc)
    // wsProvider.on('status', event => {
    //   console.log(event.status) // logs "connected" or "disconnected"
    // })
    const txt = doc.getText("monaco");
    const binding = new MonacoBinding(txt, editorRef.current.getModel()!, new Set([editorRef.current]), wsProvider.awareness)
    wsProviderRef.current=wsProvider;
  }

  const handleAddFile = async()=>{
    if(addFileName.split(".").length!=2) return;
    try{
        const resp = await axios.post(`${BASE_URL}/room/addfile`,{
            roomId:id,
            filename:addFileName
        })
        if(resp.data.status){
            socket.emit("file_add", id, addFileName);
            setAddFileName("")
        }else{
            alert(resp.data.msg);
        }
    }catch{
        console.log("Error in creating file");
    }

  }
  const handleFileClick = (fileData: string) =>{
    wsProviderRef.current?.disconnect();
    const doc = new Y.Doc();
    const wsProvider2 = new WebsocketProvider('ws://localhost:1234', id+fileData, doc)
    // wsProvider.on('status', event => {
    //   console.log(event.status) // logs "connected" or "disconnected"
    // })
    const txt = doc.getText("monaco");
    const binding = new MonacoBinding(txt, editorRef.current.getModel()!, new Set([editorRef.current]), wsProvider2.awareness)
    wsProviderRef.current=wsProvider2;
    setCurrentFile(fileData);
    setLanguage(LANGUAGE_MAP[fileData.split(".")[1]]);
  }
  useEffect(()=>{
    socket.on("participant_join", (roomId:string, username:string, roomParticipants: string[])=>{
        console.log(roomParticipants);
        
        if(id==roomId){
            // setParticipants(prev=>[...prev, username]);
            setParticipants(roomParticipants)
        }
    })
    return ()=>{
        socket.off("participant_join");
    }
  }, [])
  useEffect(()=>{
    socket.on("file_add", (roomId:string, fileName: string)=>{
        console.log();
        
        if(id==roomId){
            // setParticipants(prev=>[...prev, username]);
            setFiles(prev=>[...prev, fileName]);
        }
    })
    return ()=>{
        socket.off("file_add");
    }
  }, [])
  useEffect(()=>{
    async function getFilesAndParticipants(){
        try{
            const resp = await axios.post(`${BASE_URL}/room/getfiles`,{
                roomId:id,
            })
            if(resp.data.files){
                const files: File[]=resp.data.files;
                let fileNames: string[]=[];
                for(var i=0;i<files.length;i++){
                    fileNames.push(files[i].filename);
                }
                setFiles(fileNames)
            }
            const resp2 = await axios.post(`${BASE_URL}/room/getParticipants`,{
                roomId:id,
            })
            if(resp2.data.participants){
                setParticipants(resp2.data.participants)
            }
        }catch(err){
            console.log("Error in getting files and participants"+err);
        }
    }

    getFilesAndParticipants();
  }, [])
  if(!user){
    navigate("/")
  }
  return (
    <div className='flex h-[90vh]'>
        <div className='h-full bg-editor-bg'>
            <p className='h-[4%] text-white text-sm'>{currentFile}</p>
            <Editor
            height="96%"
            width="70vw"
            theme="vs-dark"
            language={language}
            onMount={handleEditorMount}
            ></Editor>
        </div>
        <div className='h-full w-full bg-file-bg'>
            <div className='border-b-2 border-b-gray-500'>
                <p className='text-white text-lg'>Files</p>
                <input type="text" className='rounded text-black outline-none border-none text-sm p-1 placeholder:text-black bg-gray-400' placeholder='Enter File name' onChange={(e)=>{
                    setAddFileName(e.target.value)  
                }}/>
                <button className='text-white text-sm bg-red-600 p-1 ml-2 rounded hover:bg-red-700' onClick={handleAddFile}>Add file</button>
                <div className='h-[250px] overflow-auto'>
                {files.map((file, ind)=>{
                    return <div key={file+ind} className={`p-1 pl-3 cursor-pointer ${file===currentFile? "bg-file-selected":""} hover:bg-file-bg-hover`}  onClick={()=>handleFileClick(file)}>
                        <p className='text-[#aacacb] text-sm' >{file}</p>
                    </div>
                })}
                </div>
            </div>
            <div className=''>
                <span className='text-white'>Participants</span>
                {participants.map((participant, ind)=>{
                    return <p className='text-blue-600' key={participant+ind}>{(ind+1)+participant}</p>
                })}
            </div>
        </div>
    </div>
  )
}

export default CodeSpace
