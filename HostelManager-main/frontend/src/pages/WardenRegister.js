import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router"
import { API_BASE_URL } from "../config"
import { Link } from "react-router-dom"

function WardenRegister() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    hostelName: "",
    gmail: "",
    role: "warden", // Default to warden role
    wardenCode: "",
    photo: "" // Storing Warden ID Proof
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.photo) {
      alert('Please upload your Warden ID Proof.');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/register`, formData)
      // Navigate to login after registration
      navigate('/warden/login')
      console.log(formData)
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Registration failed";
      alert(errorMsg);
      console.log({ err })
    }
  }

  return (
    <>
      <div
        className="container-fluid vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'radial-gradient(circle at top right, #1a123a 0%, #0c0d12 100%)',
          overflow: 'hidden'
        }}
      >
        <div className="card premium-card p-4" style={{ maxWidth: '400px', width: '90%' }}>
          <div className="card-body">

            <h2 className="fw-bold text-center mb-1 text-white">Warden Register</h2>
            <p className="text-center text-white-50 small mb-4">Create your administration account</p>

            <form onSubmit={handleSubmit} >
              <div className="mb-3">
                <label className="form-label small text-white-50">Username</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Hostel Name</label>
                <input
                  type="text"
                  name="hostelName"
                  value={formData.hostelName}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="Enter your hostel"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Gmail</label>
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="example@gmail.com"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Warden ID Proof</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control premium-input"
                  required
                />
              </div>

              {formData.photo && (
                <div className="mb-3 text-center">
                  <img 
                    src={formData.photo} 
                    alt="ID Proof Preview" 
                    className="rounded border border-secondary shadow-sm"
                    style={{ width: '140px', height: '90px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label small text-white-50">Secret Warden Code</label>
                <input
                  type="password"
                  name="wardenCode"
                  value={formData.wardenCode}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="Enter Secret Code"
                  required
                />
              </div>

              <button type="submit" className="btn btn-premium-primary w-100 fw-bold">
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small text-white-50">
                Already have an account? <Link to="/warden/login" className="text-decoration-none text-primary">Login</Link>
              </span>
            </div>

            <div className="text-center mt-2 border-top border-secondary pt-2">
              <span className="small text-white-50">
                Register as Student? <Link to="/register" className="text-decoration-none text-info fw-bold">Click here</Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default WardenRegister
