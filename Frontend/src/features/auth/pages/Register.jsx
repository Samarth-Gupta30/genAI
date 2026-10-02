import { useState, useEffect } from 'react'
import {useNavigate, Link} from "react-router"
import {useAuth} from "../hooks/useAuth"
import Loader from '../../../components/Loader'
const Register = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const { loading, user, handleRegister } = useAuth()

    useEffect(() => {
      if (user) {
        navigate('/', { replace: true })
      }
    }, [user, navigate])

    const handleSubmit = async(e) => {
        e.preventDefault();
        const success = await handleRegister({username, email, password})
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
        <div className="auth-brand">Kinetic Intelligence</div>
        <nav className="auth-nav" aria-label="Main navigation">
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="auth-main">
        <div className="form-container">
          <h1 className="auth-card-title">Create Account</h1>
          <p className="auth-card-subtitle">Please enter your details to sign up.</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                id="username"
                name='username'
                placeholder='Enter name'
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange ={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                name='email'
                placeholder='Enter email address'
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                onChange ={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                name='password'
                placeholder='Enter password'
              />
            </div>

            <button className='auth-submit'>Register</button>
          </form>

          <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </main>
    </div>
  )
}

export default Register