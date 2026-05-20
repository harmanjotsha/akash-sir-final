import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

function Home({ toggleWishlist, isWishlisted, setCartCount }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products`
        )
        setProducts(response.data.products)   // ← NEW - get products array!
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch products. Is backend running?')
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading products...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.center}>
        <h2 style={styles.error}>{error}</h2>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛍️ All Products</h1>
      <div style={styles.grid}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            toggleWishlist={toggleWishlist}
            isWishlisted={isWishlisted(product._id)}
            setCartCount={setCartCount}
          />
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
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '25px',
    justifyContent: 'center',
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
    fontSize: '24px',
  },
  error: {
    color: '#e94560',
    fontSize: '24px',
  },
}

export default Home