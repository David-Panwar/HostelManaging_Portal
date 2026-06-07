import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { setAuth } from '../slices/AuthSlice'
import { Link } from 'react-router-dom'
import { Toast } from 'bootstrap'
import { API_BASE_URL } from '../config'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const successToastRef = useRef(null)
  const errorToastRef = useRef(null)

  const [formData, setFormData] = useState({ name: "", gmail: "" , expectedRole : "student"})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(
        `${API_BASE_URL}/login`,
        formData,
      {withCredentials:true}
      )

      localStorage.setItem("currentAuth" , "true")
      // update redux
      dispatch(setAuth({
        isAuth : true ,
        userid: res.data.userId,
        username: res.data.username,
        role: res.data.role
      }))

      // show success toast
      const toast = new Toast(successToastRef.current)
      toast.show()

      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      console.log(err)
      const toast = new Toast(errorToastRef.current)
      toast.show()
    }
  }

  return (
    <>
      {/* ✅ Toasts */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div
          ref={successToastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">✅ Login successful! Redirecting...</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>

        <div
          ref={errorToastRef}
          className="toast align-items-center text-bg-danger border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">❌ Login failed! Check your username or email.</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

      {/* Main Login Form */}
      {/* Main Login Form */}
<div 
  className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
  style={{ 
    background: 'radial-gradient(circle at top right, #1a123a 0%, #0c0d12 100%)',
    overflow: 'hidden'
  }}
>
  <div className="card premium-card p-4" style={{ maxWidth: '400px', width: '90%' }}>
    <div className="card-body">

      <h2 className="fw-bold text-center mb-1 text-white">Welcome Back</h2>
      <p className="text-center text-white-50 small mb-4">Login to your account (Student)</p>

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

        <div className="mb-4">
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

        <button type="submit" className="btn btn-premium-primary w-100 fw-bold">
          Sign In
        </button>
      </form>

      <div className="text-center mt-3">
        <span className="small text-white-50">
          New user? <Link to={'/register'} className="text-decoration-none text-primary fw-semibold">Register</Link>
        </span>
      </div>

      <div className="text-center mt-2 border-top border-secondary pt-2">
        <span className="small text-white-50">
          Are you a Warden? <Link to={'/warden/login'} className="text-decoration-none text-success fw-bold">Login here</Link>
        </span>
      </div>

    </div>
  </div>
</div>

    </>
  )
}

export default Login
