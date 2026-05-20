import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function ProductCard({ product, toggleWishlist, isWishlisted, setCartCount }) {
  const [addingToCart, setAddingToCart] = useState(false)
  const [cartMessage, setCartMessage] = useState(null)

  const { token, user } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    setAddingToCart(true)
    setCartMessage(null)

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCartMessage('✅ Added!')
      if (setCartCount) {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCartCount(response.data.itemCount)
      }
    } catch (error) {
      setCartMessage('❌ Failed!')
    } finally {
      setAddingToCart(false)
      setTimeout(() => setCartMessage(null), 2000)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          style={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'
          }}
        />
        <button
          onClick={() => toggleWishlist(product)}
          style={styles.heartBtn}
        >
          {isWishlisted ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>
            ₹{product.price.toLocaleString()}
          </span>
          <button
            onClick={() => toggleWishlist(product)}
            style={{
              ...styles.wishlistBtn,
              backgroundColor: isWishlisted ? '#e94560' : '#1a1a2e',
            }}
          >
            {isWishlisted ? 'Wishlisted ❤️' : 'Wishlist 🤍'}
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={addingToCart}
          style={{
            ...styles.cartBtn,
            opacity: addingToCart ? 0.7 : 1,
          }}
        >
          {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
        </button>

        {cartMessage && (
          <p style={styles.cartMessage}>{cartMessage}</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    width: '280px',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '18px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: '15px',
  },
  name: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  description: {
    color: '#a8a8b3',
    fontSize: '13px',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  price: {
    color: '#e94560',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  wishlistBtn: {
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  cartBtn: {
    backgroundColor: '#0f3460',
    color: 'white',
    border: '1px solid #e94560',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    width: '100%',
    marginTop: '5px',
  },
  cartMessage: {
    textAlign: 'center',
    marginTop: '8px',
    fontSize: '13px',
    color: '#a8a8b3',
  },
}

export default ProductCard