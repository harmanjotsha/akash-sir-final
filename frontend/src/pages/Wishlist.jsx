import ProductCard from '../components/ProductCard'
import { Link } from 'react-router-dom'

function Wishlist({ wishlist, toggleWishlist, isWishlisted }) {
  if (wishlist.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyBox}>
          <p style={styles.emptyIcon}>💔</p>
          <h2 style={styles.emptyHeading}>Your Wishlist is Empty!</h2>
          <p style={styles.emptyText}>
            Looks like you haven't added anything yet.
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
        ❤️ My Wishlist ({wishlist.length} items)
      </h1>
      <div style={styles.grid}>
      {wishlist.map((product) => (
        <ProductCard
        key={product._id}
        product={product}
        toggleWishlist={toggleWishlist}
        isWishlisted={isWishlisted(product._id)}
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
  emptyContainer: {
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
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '10px',
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
}

export default Wishlist