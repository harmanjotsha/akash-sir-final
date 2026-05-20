import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  const { token } = useAuth()
  const navigate = useNavigate()

  // Initial load only
  useEffect(() => {
    fetchProducts(true)
  }, [])

  // Search/category/page changes with debouncing for search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        fetchProducts(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  // Category and page changes (no debounce needed)
  useEffect(() => {
    if (!loading) {
      fetchProducts(false)
    }
  }, [category, page])

  const fetchProducts = async (isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true)
      } else {
        setSearching(true)
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`,
        {
          params: { search, category, page, limit: 5 },
        }
      )
      setProducts(response.data.products)
      setPagination(response.data.pagination)
    } catch (error) {
      console.log('Fetch error:', error)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchProducts()
    } catch (error) {
      console.log('Delete error:', error)
    }
  }

  const getStockColor = (stock) => {
    if (stock === 0) return '#e94560'
    if (stock <= 5) return '#f39c12'
    return '#2ecc71'
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.heading}>📦 Product List</h1>
        <Link to='/admin/products/add' style={styles.addBtn}>
          ➕ Add Product
        </Link>
      </div>

      <div style={styles.filters}>
        <input
          type='text'
          placeholder='🔍 Search products...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          style={styles.searchInput}
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setPage(1)
          }}
          style={styles.select}
        >
          <option value=''>All Categories</option>
          <option value='electronics'>Electronics</option>
          <option value='phones'>Phones</option>
          <option value='computers'>Computers</option>
          <option value='accessories'>Accessories</option>
          <option value='clothing'>Clothing</option>
        </select>
      </div>

      {loading ? (
        <p style={styles.message}>⏳ Loading...</p>
      ) : (
        <>
          {searching && (
            <p style={styles.searching}>🔍 Searching...</p>
          )}
          <div style={{
            ...styles.tableContainer,
            opacity: searching ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id} style={styles.tr}>
                    <td style={styles.td}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.productImage}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <p style={styles.productName}>{product.name}</p>
                    </td>
                    <td style={styles.td}>
                      <p style={styles.price}>₹{product.price.toLocaleString()}</p>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.categoryBadge}>
                        {product.category}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.stockBadge,
                        color: getStockColor(product.stock),
                        border: `1px solid ${getStockColor(product.stock)}`,
                      }}>
                        {product.stock === 0 ? '❌ Out of Stock' : `${product.stock} left`}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          style={styles.editBtn}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          style={styles.deleteBtn}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                ...styles.pageBtn,
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              style={{
                ...styles.pageBtn,
                opacity: page === pagination.pages ? 0.5 : 1,
              }}
            >
              Next →
            </button>
          </div>
        </>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  heading: {
    color: 'white',
    fontSize: '28px',
    margin: 0,
  },
  addBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  filters: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  searchInput: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #a8a8b330',
    backgroundColor: '#16213e',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    flex: 1,
    minWidth: '200px',
  },
  select: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #a8a8b330',
    backgroundColor: '#16213e',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    minWidth: '150px',
  },
  tableContainer: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    color: '#a8a8b3',
    fontSize: '13px',
    padding: '15px 20px',
    textAlign: 'left',
    borderBottom: '1px solid #0f346060',
    backgroundColor: '#0f3460',
  },
  tr: {
    borderBottom: '1px solid #0f346030',
  },
  td: {
    padding: '15px 20px',
    verticalAlign: 'middle',
  },
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  productName: {
    color: 'white',
    fontSize: '14px',
    margin: 0,
    fontWeight: 'bold',
  },
  price: {
    color: '#e94560',
    fontSize: '14px',
    fontWeight: 'bold',
    margin: 0,
  },
  categoryBadge: {
    backgroundColor: '#0f346060',
    color: '#a8a8b3',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  stockBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    backgroundColor: 'transparent',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editBtn: {
    backgroundColor: '#3498db20',
    color: '#3498db',
    border: '1px solid #3498db',
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '12px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#e9456020',
    color: '#e94560',
    border: '1px solid #e94560',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '25px',
  },
  pageBtn: {
    backgroundColor: '#16213e',
    color: 'white',
    border: '1px solid #a8a8b330',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pageInfo: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  message: {
    color: 'white',
    textAlign: 'center',
    marginTop: '50px',
  },
  searching: {
    color: '#a8a8b3',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
  },
}

export default ProductList