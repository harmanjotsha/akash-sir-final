import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

function EditProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    stock: '',
    category: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const { token } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`
      )
      const product = response.data
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        stock: product.stock,
        category: product.category,
      })
    } catch (error) {
      setError('Failed to load product!')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/products/${id}`,
        {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess('✅ Product updated successfully!')
      setTimeout(() => navigate('/admin/products'), 1500)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={styles.center}>
        <h2 style={styles.message}>⏳ Loading product...</h2>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Link to='/admin/products' style={styles.backBtn}>← Back</Link>
        <h1 style={styles.heading}>✏️ Edit Product</h1>
      </div>

      <div style={styles.formBox}>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Product Name</label>
            <input
              name='name'
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Price (₹)</label>
              <input
                name='price'
                type='number'
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Stock</label>
              <input
                name='stock'
                type='number'
                value={formData.stock}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Category</label>
            <select
              name='category'
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
            >
              <option value='electronics'>Electronics</option>
              <option value='phones'>Phones</option>
              <option value='computers'>Computers</option>
              <option value='accessories'>Accessories</option>
              <option value='clothing'>Clothing</option>
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Image URL</label>
            <input
              name='image'
              value={formData.image}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {formData.image && (
            <img
              src={formData.image}
              alt='preview'
              style={styles.imagePreview}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name='description'
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              rows={4}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              ...styles.submitBtn,
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
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
  formBox: {
    backgroundColor: '#16213e',
    borderRadius: '15px',
    padding: '40px',
    maxWidth: '700px',
    margin: '0 auto',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  row: {
    display: 'flex',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  label: {
    color: '#a8a8b3',
    fontSize: '14px',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #a8a8b330',
    backgroundColor: '#0f3460',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #a8a8b330',
    backgroundColor: '#0f3460',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
  },
  imagePreview: {
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '10px',
    border: '2px solid #a8a8b330',
  },
  submitBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#e9456020',
    color: '#e94560',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
  },
  success: {
    backgroundColor: '#2ecc7120',
    color: '#2ecc71',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '14px',
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

export default EditProduct