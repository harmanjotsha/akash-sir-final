import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function LowStock() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchLowStock()
  }, [])

  const fetchLowStock = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/low-stock`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProducts(response.data.products)
    } catch (error) {
      console.log('Low stock error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return '#e94560'
    if (stock <= 3) return '#e74c3c'
    return '#f39c12'
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading...</h2>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to='/admin' style={styles.backBtn}>← Back to Dashboard</Link>
        <h1 style={styles.heading}>⚠️ Low Stock Products</h1>
      </div>

      {products.length === 0 ? (
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>✅</p>
          <h2 style={styles.emptyHeading}>All products are well stocked!</h2>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product._id} style={styles.card}>
              <img
                src={product.image}
                alt={product.name}
                style={styles.image}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                }}
              />
              <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.category}>{product.category}</p>
                <p style={styles.price}>₹{product.price.toLocaleString()}</p>
                <div style={{
                  ...styles.stockBadge,
                  backgroundColor: getStockColor(product.stock) + '20',
                  color: getStockColor(product.stock),
                  border: `1px solid ${getStockColor(product.stock)}`,
                }}>
                  {product.stock === 0
                    ? '❌ Out of Stock'
                    : `⚠️ Only ${product.stock} left!`}
                </div>
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  style={styles.editBtn}
                >
                  ✏️ Update Stock
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '40px',
    backgroundColor: '#0f3460',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
  },
  backBtn: {
    color: '#a8a8b3',
    textDecoration: 'none',
    fontSize: '16px',
  },
  heading: {
    color: 'white',
    fontSize: '28px',
    margin: 0,
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    overflow: 'hidden',
    width: '220px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
  },
  info: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  name: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
  },
  category: {
    color: '#a8a8b3',
    fontSize: '12px',
    margin: 0,
  },
  price: {
    color: '#e94560',
    fontSize: '16px',
    fontWeight: 'bold',
    margin: 0,
  },
  stockBadge: {
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyBox: {
    textAlign: 'center',
    padding: '60px',
  },
  emptyIcon: {
    fontSize: '60px',
  },
  emptyHeading: {
    color: 'white',
    fontSize: '24px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#0f3460',
  },
  message: {
    color: 'white',
  },
}

export default LowStock