import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Toast } from 'bootstrap'
import { API_BASE_URL } from '../config'

function CreatePost() {
  const userAuthId = useSelector((state) => state.auth.userid)
  const navigate = useNavigate()
  const toastRef = useRef(null)
  console.log(userAuthId)

  const [postData, setPostData] = useState({
    content: "",
    conditions: "",
    image: "",
    roomNumber: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setPostData(prev => 
        ({ ...prev, [name]: value } )
    )
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPostData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axios.post(`${API_BASE_URL}/post`, postData, {withCredentials:true});

    const toast = new Toast(toastRef.current);
    toast.show();

    setTimeout(() => navigate('/'), 1500);
  } catch (err) {
    console.log(err);
    navigate('/login');
  }
};

  const isAuth = JSON.parse(localStorage.getItem("currentAuth"))

  return (
    <>
     
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">✅ Post created successfully!</div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

     
      <div
        className="container-fluid min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: 'radial-gradient(circle at top right, #1a123a 0%, #0c0d12 100%)',
          overflow: 'hidden'
        }}
      >
        {isAuth ? (
          <div className="card premium-card p-5" style={{ width: '100%', maxWidth: '500px' }}>
            <h2 className="fw-bold text-center text-white mb-1">Create a Post</h2>
            <p className="text-center text-white-50 small mb-4">Share an item with your community</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-white-50">Content</label>
                <input
                  type="text"
                  name="content"
                  value={postData.content}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="What are you sharing?"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={postData.roomNumber}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="Enter your room number (e.g. 204-A)"
                  required
                />
              </div>



              <div className="mb-3">
                <label className="form-label small text-white-50">Conditions (optional)</label>
                <input
                  type="text"
                  name="conditions"
                  value={postData.conditions}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="Any conditions?"
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Image of Problem (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control premium-input"
                />
              </div>

              {postData.image && (
                <div className="mb-4 text-center">
                  <img 
                    src={postData.image} 
                    alt="Problem Preview" 
                    className="img-fluid rounded border border-secondary"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-premium-primary w-100 fw-bold"
              >
                Publish Post
              </button>
            </form>
          </div>
        ) : (
          <div className="card premium-card p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
            <h5 className="mb-2 text-white">You are not logged in</h5>
            <p className="text-white-50 small mb-3">Please login to create a post</p>
            <button
              className="btn btn-premium-primary w-100 fw-bold"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default CreatePost
