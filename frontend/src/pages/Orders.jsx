import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { token, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user, token])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log('Orders:', response.data)
      setOrders(response.data.orders || [])
    } catch (error) {
      console.log('Orders error:', error.response?.data)
      setError('Failed to load orders!')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12'
      case 'processing': return '#3498db'
      case 'shipped': return '#9b59b6'
      case 'delivered': return '#2ecc71'
      case 'cancelled': return '#e94560'
      default: return '#a8a8b3'
    }
  }

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'processing': return '⚙️'
      case 'shipped': return '🚚'
      case 'delivered': return '✅'
      case 'cancelled': return '❌'
      default: return '📦'
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading orders...</h2>
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

  if (orders.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>📦</p>
          <h2 style={styles.emptyHeading}>No Orders Yet!</h2>
          <p style={styles.emptyText}>
            You haven't placed any orders yet.
          </p>
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
        📦 My Orders ({orders.length})
      </h1>
      <div style={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} style={styles.orderCard}>

            <div style={styles.orderHeader}>
              <div>
                <p style={styles.orderId}>
                  Order ID: <span style={styles.orderIdValue}>
                    #{order._id.slice(-8).toUpperCase()}
                  </span>
                </p>
                <p style={styles.orderDate}>
                  📅 {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(order.orderStatus) + '20',
                color: getStatusColor(order.orderStatus),
                border: `1px solid ${getStatusColor(order.orderStatus)}`,
              }}>
                {getStatusEmoji(order.orderStatus)} {order.orderStatus.toUpperCase()}
              </span>
            </div>

            <div style={styles.divider} />

            <div style={styles.productsList}>
              {order.products.map((item, index) => (
                <div key={index} style={styles.productRow}>
                  {item.product ? (
                    <>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={styles.productImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x60?text=No+Image'
                        }}
                      />
                      <div style={styles.productInfo}>
                        <p style={styles.productName}>{item.product.name}</p>
                        <p style={styles.productMeta}>
                          Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p style={styles.productTotal}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <p style={styles.deletedProduct}>Product no longer available</p>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.divider} />

            <div style={styles.orderFooter}>
              <p style={styles.itemCount}>
                {order.products.length} item{order.products.length > 1 ? 's' : ''}
              </p>
              <p style={styles.totalAmount}>
                Total: <span style={styles.totalValue}>
                  ₹{order.totalAmount.toLocaleString()}
                </span>
              </p>
            </div>

          </div>
        ))}
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
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  orderCard: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  orderId: {
    color: '#a8a8b3',
    fontSize: '14px',
    marginBottom: '5px',
  },
  orderIdValue: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  orderDate: {
    color: '#a8a8b3',
    fontSize: '13px',
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#0f346060',
    margin: '15px 0',
  },
  productsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  productRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: 'white',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '4px',
  },
  productMeta: {
    color: '#a8a8b3',
    fontSize: '13px',
  },
  productTotal: {
    color: '#e94560',
    fontSize: '15px',
    fontWeight: 'bold',
  },
  deletedProduct: {
    color: '#a8a8b3',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCount: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  totalAmount: {
    color: '#a8a8b3',
    fontSize: '16px',
  },
  totalValue: {
    color: '#e94560',
    fontSize: '22px',
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

export default Orders