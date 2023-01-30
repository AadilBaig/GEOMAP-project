import React from 'react'
import "./Login.css"

const Login = () => {
  return (
    <div className='login_container'>
        <div className='application'>
            Login to your account
        </div>

        <form>
            <input type="text" placeholder='username'/>
            <input type="password" placeholder='password'/>
            <button className='login_button'>Login</button>
        </form>
    </div>
  )
}

export default Login