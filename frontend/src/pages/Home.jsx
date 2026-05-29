import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

function Home({ toggleWishlist, isWishlisted, setCartCount }) {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {

    const fetchProducts = async () => {

      try {

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products?limit=20`
        )

        console.log("API Response:", response.data)

        // FIXED ERROR HERE
        if (
          response.data.products &&
          Array.isArray(response.data.products)
        ) {

          setProducts(response.data.products)

        } else if (Array.isArray(response.data)) {

          setProducts(response.data)

        } else {

          setProducts([])
        }

        setLoading(false)

      } catch (err) {

        console.log(err)

        setError('Failed to fetch products. Is backend running?')

        setLoading(false)
      }
    }

    fetchProducts()

  }, [])

  if (loading) {

    return (
      <div className="page-center">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "linear"
          }}
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%'
          }}
        />

      </div>
    )
  }

  if (error) {

    return (
      <div className="page-center">
        <h2 className="heading-3 text-error">
          {error}
        </h2>
      </div>
    )
  }

  return (

    <div style={{ backgroundColor: 'var(--bg-main)' }}>

      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '0 1.5rem',
          marginTop: '1rem',
          marginBottom: '4rem'
        }}
      >

        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#e5e7eb',
            height: 'min(70vh, 600px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >

          {/* Background Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.5,
              backgroundImage:
                'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
              zIndex: 1
            }}
          ></div>

          <img
            src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80"
            alt="Hero Tech Essentials"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              zIndex: 2
            }}
          />

          <div
            style={{
              position: 'absolute',
              zIndex: 3,
              width: '100%',
              textAlign: 'center',
              pointerEvents: 'none'
            }}
          >

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
              className="heading-serif"
              style={{
                fontSize: 'clamp(4rem, 15vw, 12rem)',
                lineHeight: 0.8,
                color: '#111827',
                margin: 0,
                textTransform: 'uppercase',
                mixBlendMode: 'overlay',
                opacity: 0.9
              }}
            >
              ESSENTIALS
            </motion.h1>

          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '2rem',
              zIndex: 4
            }}
          >

            <button
              className="btn btn-primary"
              onClick={() =>
                document
                  .getElementById('products-grid')
                  .scrollIntoView({
                    behavior: 'smooth'
                  })
              }
              style={{
                padding: '0.8rem 2rem',
                fontSize: '0.9rem',
                borderRadius: '30px',
                backgroundColor: '#000',
                color: '#fff',
                border: 'none'
              }}
            >
              Shop Now
            </button>

          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              right: '2rem',
              zIndex: 4,
              textAlign: 'right',
              maxWidth: '200px'
            }}
          >

            <p
              style={{
                fontSize: '0.75rem',
                color: '#333',
                fontWeight: 500
              }}
            >
              Step into Effortless
              <br />
              Elegance With Purpose
            </p>

          </div>

        </div>

      </section>

      {/* Products Section */}
      <section
        id="products-grid"
        className="container"
        style={{
          paddingBottom: '6rem'
        }}
      >

        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}
        >

          <h2
            className="heading-serif"
            style={{
              fontSize: '2.5rem',
              marginBottom: '0.5rem',
              color: '#111827'
            }}
          >
            New Arrivals
          </h2>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Our New Arrivals Are Built To Withstand Your Activities
            While Keeping You Looking Your Best!
          </p>

        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{
            once: true,
            margin: "-100px"
          }}
          className="grid-auto-fit"
        >

          {products?.length > 0 ? (

            products.map((product) => (

              <motion.div
                key={product._id}
                variants={itemVariants}
              >

                <ProductCard
                  product={product}
                  toggleWishlist={toggleWishlist}
                  isWishlisted={isWishlisted(product._id)}
                  setCartCount={setCartCount}
                />

              </motion.div>

            ))

          ) : (

            <h2 style={{ textAlign: 'center' }}>
              No Products Found
            </h2>

          )}

        </motion.div>

      </section>

    </div>
  )
}

export default Home
