import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar({ wishlist, cartCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🛍️ ShopApp</div>
      <div style={styles.links}>
        <Link to='/' style={styles.link}>Home</Link>
        <Link to='/wishlist' style={styles.link}>
          ❤️ Wishlist
          {wishlist.length > 0 && (
            <span style={styles.badge}>{wishlist.length}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to='/cart' style={styles.link}>
              🛒 Cart
              {cartCount > 0 && (
                <span style={styles.badge}>{cartCount}</span>
              )}
            </Link>
            <Link to='/orders' style={styles.link}>
                📦 Orders   
            </Link>
            {user.role === 'admin' && (
            <Link to='/admin' style={styles.adminBtn}>
                ⚙️ Admin
             </Link>
            )}
            <span style={styles.username}>👤 {user.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to='/login' style={styles.link}>Login</Link>
            <Link to='/register' style={styles.loginBtn}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  adminBtn: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '6px 15px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 40px',
    backgroundColor: '#1a1a2e',
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#e94560',
  },
  links: {
    display: 'flex',
    gap: '25px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    position: 'relative',
  },
  badge: {
    backgroundColor: '#e94560',
    color: 'white',
    borderRadius: '50%',
    padding: '2px 7px',
    fontSize: '12px',
    marginLeft: '5px',
  },
  username: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '6px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  loginBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '6px 15px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
}

export default Navbar