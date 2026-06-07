import { useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router"
import { API_BASE_URL } from "../config"
import { Link } from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    hostelName: "",
    gmail: "",
    role: "",
    photo: "",
    wardenCode: "",
    rollNumber: ""
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

  console.log();
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.role === 'student' && !formData.rollNumber) {
      alert("Please enter your College Roll Number.");
      return;
    }
    if (!formData.photo) {
      const documentName = formData.role === 'warden' ? 'Warden ID Proof' : 'Hostel ID Card';
      alert(`Please upload your ${documentName}.`);
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/register`, formData)
      // Navigate to login after registration
      navigate('/login')
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

            <h2 className="fw-bold text-center mb-1 text-white">Create Account</h2>
            <p className="text-center text-white-50 small mb-4">Register to start using the app</p>

            <form onSubmit={handleSubmit}>
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
                <label className="form-label small text-white-50">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select premium-input"
                  required
                >
                  <option value="">select role-</option>
                  <option value="student">Student</option>
                  <option value="warden">Warden</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <div className="mb-3">
                  <label className="form-label small text-white-50">College Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="form-control premium-input"
                    placeholder="Enter your college roll number"
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-white-50">
                  {formData.role === 'warden' ? 'Warden ID Proof' : 'Hostel ID Card'}
                </label>
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
                    alt={formData.role === 'warden' ? 'Warden ID Proof Preview' : 'Hostel ID Card Preview'}
                    className="rounded border border-secondary shadow-sm"
                    style={{ width: '140px', height: '90px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {formData.role === 'warden' && (
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
              )}

              <button type="submit" className="btn btn-premium-primary w-100 fw-bold">
                Register
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small text-white-50">
                Already have an account? <Link to="/login" className="text-decoration-none text-primary fw-semibold">Login</Link>
              </span>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Register
