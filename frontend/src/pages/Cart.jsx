import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Cart({ setCartCount }) {
  const [cartItems, setCartItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [placingOrder, setPlacingOrder] = useState(false)      // ← NEW
  const [orderMessage, setOrderMessage] = useState(null)        // ← NEW

  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [user, token])

  const fetchCart = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/cart`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Cart data:', response.data)
      setCartItems(response.data.cartItems || [])
      setTotal(response.data.total || 0)
      setCartCount(response.data.itemCount || 0)
      setLoading(false)
    } catch (error) {
      console.log('Cart fetch error:', error.response?.data)
      setError('Failed to load cart!')
      setLoading(false)
    }
  }

  const updateQuantity = (cartItemId, action) => {
    const updatedItems = cartItems.map((item) => {
      if (item._id === cartItemId) {
        const newQuantity = action === 'increase' ? item.quantity + 1 : Math.max(1, item.quantity - 1)
        return { ...item, quantity: newQuantity }
      }
      return item
    })

    setCartItems(updatedItems)

    const newTotal = updatedItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
    setTotal(newTotal)
    setCartCount(updatedItems.length)

    axios.patch(
      `${import.meta.env.VITE_API_URL}/api/cart/${cartItemId}`,
      { action },
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((error) => {
      console.log('Update error:', error.response?.data)
      fetchCart()
    })
  }

  const removeItem = (cartItemId) => {
    const updatedItems = cartItems.filter((item) => item._id !== cartItemId)
    setCartItems(updatedItems)

    const newTotal = updatedItems.reduce((acc, item) => {
      return acc + item.product.price * item.quantity
    }, 0)
    setTotal(newTotal)
    setCartCount(updatedItems.length)

    axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/${cartItemId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    ).catch((error) => {
      console.log('Remove error:', error.response?.data)
      fetchCart()
    })
  }

  const handlePlaceOrder = async () => {       // ← NEW
    try {
      setPlacingOrder(true)
      setOrderMessage(null)

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setOrderMessage('✅ Order placed successfully!')
      setCartItems([])
      setTotal(0)
      setCartCount(0)

      setTimeout(() => {
        navigate('/orders')
      }, 1500)

    } catch (error) {
      setOrderMessage(`❌ ${error.response?.data?.message || 'Failed to place order!'}`)
    } finally {
      setPlacingOrder(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading cart...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={styles.errorMsg}>{error}</h2>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>🛒</p>
          <h2 style={styles.emptyHeading}>Your Cart is Empty!</h2>
          <p style={styles.emptyText}>Add some products to your cart</p>
          <Link to='/' style={styles.shopBtn}>
            🛍️ Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>
        🛒 My Cart ({cartItems.length} items)
      </h1>
      <div style={styles.cartLayout}>
        <div style={styles.itemsList}>
          {cartItems.map((item) => {
            if (!item.product) return null

            return (
              <div key={item._id} style={styles.cartItem}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'
                  }}
                />
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.product.name}</h3>
                  <p style={styles.itemPrice}>
                    ₹{item.product.price.toLocaleString()}
                  </p>
                </div>
                <div style={styles.quantityControl}>
                  <button
                    onClick={() => updateQuantity(item._id, 'decrease')}
                    style={styles.qtyBtn}
                  >
                    −
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, 'increase')}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>
                <p style={styles.itemTotal}>
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  style={styles.deleteBtn}
                >
                  🗑️
                </button>
              </div>
            )
          })}
        </div>

        <div style={styles.summary}>
          <h2 style={styles.summaryHeading}>Order Summary</h2>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Items:</span>
            <span style={styles.summaryValue}>{cartItems.length}</span>
          </div>
          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Total:</span>
            <span style={styles.totalPrice}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <button                                    
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            style={{
              ...styles.checkoutBtn,
              opacity: placingOrder ? 0.7 : 1,
            }}
          >
            {placingOrder ? '⏳ Placing Order...' : '🛒 Place Order'}
          </button>
          {orderMessage && (
            <p style={styles.orderMessage}>{orderMessage}</p>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#0f3460',
    minHeight: '100vh',
  },
  heading: {
    color: 'white',
    fontSize: '32px',
    marginBottom: '30px',
    textAlign: 'center',
  },
  cartLayout: {
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemsList: {
    flex: 1,
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  cartItem: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  image: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '5px',
  },
  itemPrice: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#0f3460',
    padding: '8px 15px',
    borderRadius: '10px',
  },
  qtyBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '20px',
    textAlign: 'center',
  },
  itemTotal: {
    color: '#e94560',
    fontSize: '16px',
    fontWeight: 'bold',
    minWidth: '100px',
    textAlign: 'right',
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
  },
  summary: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '30px',
    width: '300px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  summaryHeading: {
    color: 'white',
    fontSize: '20px',
    marginBottom: '20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
  },
  summaryLabel: {
    color: '#a8a8b3',
    fontSize: '16px',
  },
  summaryValue: {
    color: 'white',
    fontSize: '16px',
  },
  totalPrice: {
    color: '#e94560',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  checkoutBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    width: '100%',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
  },
  orderMessage: {                              // ← NEW
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#0f3460',
  },
  emptyBox: {
    textAlign: 'center',
    backgroundColor: '#16213e',
    padding: '60px 80px',
    borderRadius: '20px',
  },
  emptyIcon: {
    fontSize: '80px',
  },
  emptyHeading: {
    color: 'white',
    fontSize: '28px',
    marginBottom: '10px',
  },
  emptyText: {
    color: '#a8a8b3',
    fontSize: '16px',
    marginBottom: '30px',
  },
  shopBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  message: {
    color: 'white',
  },
  errorMsg: {
    color: '#e94560',
  },
}

export default Cart