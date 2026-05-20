import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Wishlist from './pages/Wishlist'
import Cart from './pages/Cart'
import Orders from './pages/Orders'          
import Login from './pages/Login'
import Register from './pages/Register'
import { useAuth } from './context/AuthContext'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProductList from './pages/admin/ProductList'
import AddProduct from './pages/admin/AddProduct'
import EditProduct from './pages/admin/EditProduct'
import LowStock from './pages/admin/LowStock'
import AdminRoute from './components/AdminRoute'

function App() {
  const [wishlist, setWishlist] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchCartCount = async () => {
      if (user && token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          setCartCount(response.data.itemCount)
        } catch (error) {
          console.log('Cart count fetch error:', error)
        }
      } else {
        setCartCount(0)
      }
    }
    fetchCartCount()
  }, [user, token])

  const toggleWishlist = (product) => {
    const exists = wishlist.find((item) => item._id === product._id)
    if (exists) {
      setWishlist(wishlist.filter((item) => item._id !== product._id))
    } else {
      setWishlist([...wishlist, product])
    }
  }

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item._id === productId)
  }

  return (
    <div>
      <Navbar wishlist={wishlist} cartCount={cartCount} />
      <Routes>
      <Route
        path='/admin'
        element={
      <AdminRoute>
      <AdminDashboard />
      </AdminRoute>
      }
    />
      <Route
      path='/admin/products'
      element={
      <AdminRoute>
      <ProductList />
      </AdminRoute>
     }
    />
    <Route
    path='/admin/products/add'
    element={
    <AdminRoute>
      <AddProduct />
    </AdminRoute>
    }
    />
    <Route
    path='/admin/products/edit/:id'
    element={
    <AdminRoute>
      <EditProduct />
    </AdminRoute>
    }
    />
    <Route 
    path='/admin/products/low-stock'
    element={
    <AdminRoute>
      <LowStock />
    </AdminRoute>
    }
    />
        <Route
          path='/'
          element={
            <Home
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
              setCartCount={setCartCount}
            />
          }
        />
        <Route
          path='/wishlist'
          element={
            <Wishlist
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              isWishlisted={isWishlisted}
            />
          }
        />
        <Route
          path='/cart'
          element={<Cart setCartCount={setCartCount} />}
        />
        <Route
          path='/orders'
          element={<Orders />}                
        />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </div>
  )
}

export default App