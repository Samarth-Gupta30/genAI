import { useState, useEffect } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import {useAuth} from "../hooks/useAuth"
import Loader from '../../../components/Loader'
const Login =() =>{

const { loading, user, handleLogin } = useAuth()
const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const navigate = useNavigate();

useEffect(() => {
  if (user) {
    navigate('/', { replace: true })
  }
}, [user, navigate])

const handleSubmit = async(e) => {
        e.preventDefault();
        const success = await handleLogin({email, password})
        if (success) {
            navigate("/", { replace: true })
        }
    };


if(loading){
    return (<main><Loader /></main>)
}


  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="auth-brand">InterviewPilot</div>
        <nav className="auth-nav" aria-label="Main navigation">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="auth-main">
        <div className="form-container">
          <h1 className="auth-card-title">Welcome Back</h1>
          <p className="auth-card-subtitle">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e)=>{setEmail(e.target.value)}}
                type="email"
                id="email"
                name='email'
                placeholder='Enter email address'
              />
            </div>

            <div className="input-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <a href="#" className="forgot-link">Forgot Password?</a>
              </div>
              <input
                onChange={(e)=>{setPassword(e.target.value)}}
                type="password"
                id="password"
                name='password'
                placeholder='Enter password'
              />
            </div>

            <button className='auth-submit'>Login</button>
          </form>

          <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Login