import React, {useState} from "react";
import axios from "axios"
import {NavLink, useNavigate } from "react-router-dom";


const Login = (props) => {
  return (
    <div>
      <form className = "looper__input"  action = "/login" method = "POST">
        <input type = "text" placeholder="ID" id = "userId" name = "userId"></input>
        <input type = "password" placeholder= "Password" id = "userPw" name = "userPw"></input>
        <button>Login</button>
      </form> 
      <NavLink to = '/register' >Don't have account?</NavLink>
    </div>
  )
}
export const Logout = (props) => {
  const navigate = useNavigate()
  const logoutHandler = async () => {
    try{
      const res = await axios.delete('/logout', {logout : true})
      if(res.status === 200){
        props.setSession(false)
        navigate('/login')
      }
    }
    catch(err){
      console.log(err)
    }
    
  }
  return <button onClick = {logoutHandler} >Logout</button>
}

export const Registration = (props) => {
  const [idStatus, setIdStatus] = useState(false)

  const checkHandler = async (e) => {
    e.preventDefault()
    const idTester = /^\w{2,20}$/
    const val = e.target.parentNode.querySelector('#userRegisterId').value.trimEnd()
    console.log(val)
    console.log(val.match(idTester))
    if(val.match(idTester)){
      const res = await axios.post('/id-check', {val})
      if(res.data){
        window.alert('You can use it!')
        setIdStatus(true)
      }else{
        window.alert('ID already exists')
      }
    }

  }

  const formHandler = async (e) => {
    e.preventDefault()
    const nickTester = /^\w{2,20}$/
    const pwTester = /^(?=.*[a-zA-Z])(?=.*[\d])(?=.*[~!@#$%^&*])[a-zA-Z\d~!@#$%^&*]{8,}$/

    let validNick = false
    let validPw = false
    
    const usrNickname = e.target.querySelector('#userRegisterName').value.trimEnd()
    const usrPw = e.target.querySelector('#userRegisterPw').value.trimEnd()
    const usrId = e.target.querySelector('#userRegisterId').value.trimEnd()
    const registTime = new Date(Date.now()).toISOString().replace('T', ' ').slice(0, -5)
    
    console.log(usrNickname)
    console.log(usrNickname.match(nickTester))
    console.log(usrPw.match(pwTester))

    if(usrNickname.match(nickTester))
      validNick = true
    if(usrPw.match(pwTester))
      validPw = true
    
    if(validNick && validPw && idStatus){
        const res = await axios.post('/register', {usrNickname, usrPw, usrId, registTime})
    }

    
  
  }

  const keyFilter = (e) => {
    if(e.key === ' ') e.preventDefault()
  } 
  
  return (
    <form action = "/register" onSubmit = {formHandler}  method = "POST">
      <input type = "text" onKeyDown={keyFilter} placeholder = "Enter Nickname"  id = "userRegisterName" name = "userNickname" /> 
      <input type = "text" onKeyDown={keyFilter}placeholder = "Enter ID"  id = "userRegisterId" name = "userId" />
      <button onClick = {checkHandler} id = "idCheckButton" >Check</button>
      <input type = "password" onKeyDown = {keyFilter} placeholder = "Enter Password"  id = "userRegisterPw" name = "userPw" />
      <button>Register</button>
    </form>
  )
}

export const NavPage = (props) => {
  return (
    <div>
      <NavLink to ='/login'>Login</NavLink>
      <br></br>
      <NavLink to = '/register'>Register</NavLink>
    </div>
  )
}



export default Login

  

