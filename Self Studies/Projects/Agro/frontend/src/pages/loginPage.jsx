import React from 'react'
import LoginForm from '../components/loginForm'
import LogoPng from '../components/logoPng'
import { Link } from 'react-router-dom'
import './styles/loginPage.css'

const LoginPage = () => {
  return (
    <div className="outerFrame">
        {/* logo img */}
        <div className='logoInLogin'>
          <LogoPng widthValue={'75px'}/>
        </div>

        {/* login form */}
         <div className="loginFrame">
            <h3>Login</h3>
            <LoginForm />
            <a className="forgotLink" href="/change">Forget Password</a>
            <p className='notYet'>Don't have an account yet ? <Link to={'/register'}><span>Create</span></Link></p>
         </div>

        {/* footer */}
    </div>
  )
}

export default LoginPage