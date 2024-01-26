import { useState } from 'react'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import AppBar from './components/AppBar';
import Room from './pages/Room';
import CodeSpace from './pages/CodeSpace';
import { RecoilRoot } from 'recoil';
function App() {
  const [count, setCount] = useState<number>(0)

  return (
    <RecoilRoot>
      <Router>
      <AppBar/>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        {/* <Route path="/room/new" element={<CodeSpace/>}></Route> */}
        <Route path='room/:id' element={<CodeSpace/>}></Route>
      </Routes>
    </Router>
    </RecoilRoot>
  )
}

export default App
