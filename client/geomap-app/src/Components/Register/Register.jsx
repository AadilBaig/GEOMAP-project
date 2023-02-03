import React, {useRef} from 'react'
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import "./Register.css"

const Register = ({setShowRegister}) => {

      const nameRef = useRef()
      const emailRef = useRef()
      const passRef = useRef()

      const handleSubmit = async(e) => {
        e.preventDefault()

        const newUser = {
          userName : nameRef.current.value,
          email : emailRef.current.value,
          pass : passRef.current.value,
        }

        try {
          const response = await axios.post("/users/register", newUser)
          console.log(response)

          setShowRegister(false)
          
        } catch (err) {
          console.log(err)
        }
      }
      
  return (
    <div className='registerContainer'>
      <div className='application'>
          
          Register For an Account
      </div>
      <form onSubmit={handleSubmit}>
          <input type= "text" placeholder='username' ref={nameRef}/>
          <input type= "email" placeholder='email' ref={emailRef}/>
          <input type= "password" placeholder='password' ref={passRef}/>
          <button className='register_button'>Register</button>
      </form>
      <CloseIcon className='register_close' onClick={() => setShowRegister(false)}/>
    </div>
  )
}

export default Register