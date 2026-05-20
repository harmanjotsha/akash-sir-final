import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      })

      login(
        {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        },
        response.data.token
      )

      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.heading}>👋 Welcome Back!</h2>
        <p style={styles.subheading}>Login to access your cart</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button
            onClick={handleSubmit}
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p style={styles.bottomText}>
          Don't have an account?{' '}
          <Link to='/register' style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#0f3460',
  },
  box: {
    backgroundColor: '#16213e',
    padding: '50px',
    borderRadius: '20px',
    width: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  heading: {
    color: 'white',
    fontSize: '28px',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    color: '#a8a8b3',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '30px',
  },
  error: {
    backgroundColor: '#e9456020',
    color: '#e94560',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #a8a8b330',
    backgroundColor: '#0f3460',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  bottomText: {
    color: '#a8a8b3',
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
  },
  link: {
    color: '#e94560',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}

export default Login