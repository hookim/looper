import React, {useState, useEffect} from "react"
import {BrowserRouter, Routes, Route, Navigate, NavLink} from 'react-router-dom'
import axios from 'axios'
import Main from "./Main"
import Looper from "./Looper"
import Login, {NavPage, Registration} from "./Login"

// const checkSession = async () => {
//   axios.get('/looper/check-session');
// }


const App = (props) => {
  const [isSession, setSession] = useState(false)
  

  /*
    Check if session is created in the server.isSession decides where to redirect.
  */
  useEffect(() => {
    const checkSession = async () => {
      try{
        const res = await axios.get('/session-check')
        console.log(res.data)
        if(res.data)
          setSession(true)
        else
          setSession(false)
      }
      catch(err){
        console.log(err)
      }
    }
    
    checkSession()  
  })

  
  return (
    <BrowserRouter>
      {isSession ? <Navigate to = "/main" /> : null }
      <Routes>
        <Route path = "/" element = {<NavPage/>}/>
        <Route path = "/login" element = {<Login />} />
        <Route path = "/main" element = {<Main setSession = {setSession}/>} />
        <Route path = "/register" element = {<Registration/>} />
      </Routes>
      
    </BrowserRouter>
  )  
  
    // <BrowserRouter>
    //       <Routes>
    //           <Route path = "/" element = {<Login/>} />
    //           <Route path = "/main" element = {<Main/>} />
    //           <Route path = "/looper" element = {<Looper/>} />
    //       </Routes>
    //   </BrowserRouter>
  
}

export default App;
