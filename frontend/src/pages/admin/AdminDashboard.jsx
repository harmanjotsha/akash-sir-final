import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalOrders: 0,
  })
  const [loading, setLoading] = useState(true)
  const { token } = useAuth()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, lowStockRes, ordersRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/low-stock`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      setStats({
        totalProducts: productsRes.data.pagination.total,
        lowStockProducts: lowStockRes.data.products.filter(p => p.stock > 0).length,
        outOfStockProducts: lowStockRes.data.products.filter(p => p.stock === 0).length,
        totalOrders: ordersRes.data.count,
      })
    } catch (error) {
      console.log('Stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading dashboard...</h2>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>⚙️ Admin Dashboard</h1>

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #3498db' }}>
          <p style={styles.statNumber}>{stats.totalProducts}</p>
          <p style={styles.statLabel}>Total Products</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #f39c12' }}>
          <p style={styles.statNumber}>{stats.lowStockProducts}</p>
          <p style={styles.statLabel}>Low Stock</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #e94560' }}>
          <p style={styles.statNumber}>{stats.outOfStockProducts}</p>
          <p style={styles.statLabel}>Out of Stock</p>
        </div>
        <div style={{ ...styles.statCard, borderTop: '4px solid #2ecc71' }}>
          <p style={styles.statNumber}>{stats.totalOrders}</p>
          <p style={styles.statLabel}>Total Orders</p>
        </div>
      </div>

      <div style={styles.actionsGrid}>
        <Link to='/admin/products' style={styles.actionCard}>
          <p style={styles.actionIcon}>📦</p>
          <h3 style={styles.actionTitle}>Manage Products</h3>
          <p style={styles.actionDesc}>View, edit and delete products</p>
        </Link>
        <Link to='/admin/products/add' style={styles.actionCard}>
          <p style={styles.actionIcon}>➕</p>
          <h3 style={styles.actionTitle}>Add Product</h3>
          <p style={styles.actionDesc}>Add new product to store</p>
        </Link>
        <Link to='/admin/products/low-stock' style={styles.actionCard}>
          <p style={styles.actionIcon}>⚠️</p>
          <h3 style={styles.actionTitle}>Low Stock</h3>
          <p style={styles.actionDesc}>Products running low</p>
        </Link>
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
  statsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '25px 40px',
    textAlign: 'center',
    minWidth: '150px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  statNumber: {
    color: 'white',
    fontSize: '40px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  statLabel: {
    color: '#a8a8b3',
    fontSize: '14px',
    margin: 0,
  },
  actionsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  actionCard: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    width: '200px',
    textDecoration: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'transform 0.2s',
  },
  actionIcon: {
    fontSize: '40px',
    margin: '0 0 10px 0',
  },
  actionTitle: {
    color: 'white',
    fontSize: '16px',
    marginBottom: '8px',
  },
  actionDesc: {
    color: '#a8a8b3',
    fontSize: '13px',
    margin: 0,
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

export default AdminDashboard