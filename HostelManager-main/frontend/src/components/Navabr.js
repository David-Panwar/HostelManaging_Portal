import axios from 'axios'
import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Toast } from 'bootstrap'
import { API_BASE_URL } from '../config'

function Navabr() {
  const navigate = useNavigate()
  const isAuth = JSON.parse(localStorage.getItem("currentAuth"))
  const username = JSON.parse(localStorage.getItem("username"))
  const role = JSON.parse(localStorage.getItem("role"))
  const toastRef = useRef(null)

  const handleLogOut = async () => {
    try {
      await axios.get(`${API_BASE_URL}/logout`, { withCredentials: true })
      localStorage.setItem("currentAuth", JSON.stringify(false))
      localStorage.removeItem("userid")
      localStorage.removeItem("username")
      localStorage.removeItem("role")

      // toast
      const toast = new Toast(toastRef.current)
      toast.show()

     
      setTimeout(() => navigate('/login'), 1200)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {/* Toast */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              ✅ Logged out successfully
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark px-3"
        style={{
          background: 'rgba(44, 45, 58, 0.7)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-white" to="/">
            What's the Problem
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">

              {isAuth ? (
                <>
                  <li className="nav-item d-flex align-items-center">
                    <span 
                      className="badge d-flex align-items-center gap-2 px-3 py-2"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#f8fafc',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '999px',
                        fontSize: '0.85rem'
                      }}
                    >
                      <span>🎓</span>
                      <strong>{username || 'Student'}</strong>
                    </span>
                  </li>

                  {role !== 'warden' && (
                    <li className="nav-item">
                      <Link className="nav-link btn btn-primary btn-sm px-3" to="/post">
                        Create Post
                      </Link>
                    </li>
                  )}

                  <li className="nav-item">
                    <button
                      className="btn btn-outline-danger btn-sm px-3"
                      onClick={handleLogOut}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/login">Login</Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/register">Register</Link>
                  </li>

                  {role !== 'warden' && (
                    <li className="nav-item">
                      <Link className="btn btn-primary btn-sm px-3" to="/post">
                        Create Post
                      </Link>
                    </li>
                  )}
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navabr
