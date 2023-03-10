import React from 'react'
import { useRef } from 'react'
import "./Login.css"
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const userLoggedIn = (userS) => {
  toast.success("Successfully logged in. Welcome " + userS + "!")
}

const userLoginFail = () => {
  toast.error("Failed to login.")
}

const Login = ({setShowLogin, setCurrentUser}) => {

    const nameRef = useRef()
    
    const passRef = useRef()

    const handleSubmit = async(e) => {
      e.preventDefault()

      const newUser = {
        userName : nameRef.current.value,
        pass : passRef.current.value
      }
      try {
        const response = await axios.post("/users/login", newUser)
        //success notification
        userLoggedIn(response.data.userName)
        console.log(response)
        setCurrentUser(response.data.userName)
        setShowLogin(false)
      } catch (err) {
        userLoginFail()
        console.log(err)
      }

    }

  return (
    <div className='login_container'>
        <div className='application'>
            Login to your account
        </div>

        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='username' ref={nameRef}/>
            <input type="password" placeholder='password' ref={passRef}/>
            <button className='login_button'>Login</button>
        </form>
        <CloseIcon className='login_cancel' onClick={() => setShowLogin(false)}/>
    </div>
  )
}

export default Login