import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Toast } from 'bootstrap'
import { API_BASE_URL } from '../config'

function WardenCreatePost() {
  const userAuthId = useSelector((state) => state.auth.userid)
  const navigate = useNavigate()
  const toastRef = useRef(null)
  console.log(userAuthId)

  const [postData, setPostData] = useState({
    content: "",
    tillTime:"" ,
    conditions: "",
    image: ""
  })

  const [activePreset, setActivePreset] = useState(null)

  const setPresetTime = (hours) => {
    setActivePreset(hours)
    const date = new Date()
    date.setHours(date.getHours() + hours)
    
    const pad = (num) => String(num).padStart(2, '0')
    const localDatetime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    
    setPostData(prev => ({ ...prev, tillTime: localDatetime }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "tillTime") {
      setActivePreset(null)
    }
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

  const tillDate = new Date(postData.tillTime);
  const now = new Date();

  if (tillDate <= now) {
    alert("Please select a future date and time!");
    return;
  }

  const maxLimit = new Date();
  maxLimit.setMonth(maxLimit.getMonth() + 1);
  if (tillDate > maxLimit) {
    alert("Notice duration cannot exceed one month from the present time!");
    return;
  }

  try {
    const payload = { ...postData, tillTime: tillDate };
    await axios.post(`${API_BASE_URL}/post`, payload, { withCredentials: true });

    const toast = new Toast(toastRef.current);
    toast.show();

    setTimeout(() => navigate('/'), 1500);
  } catch (err) {
    console.log(err);
    navigate('/warden/login');
  }
};


  const nowTime = new Date()
  const oneMonthLater = new Date()
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)
  const pad = (num) => String(num).padStart(2, '0')
  const formatDatetime = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
  const minDatetime = formatDatetime(nowTime)
  const maxDatetime = formatDatetime(oneMonthLater)

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
            <div className="toast-body">✅ Notice created successfully!</div>
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
            <h2 className="fw-bold text-center text-white mb-1">Create a Notice (Warden)</h2>
            <p className="text-center text-white-50 small mb-4">Share information or alerts with students</p>

            <form onSubmit={handleSubmit} >
              <div className="mb-3">
                <label className="form-label small text-white-50">Content</label>
                <input
                  type="text"
                  name="content"
                  value={postData.content}
                  onChange={handleChange}
                  className="form-control premium-input"
                  placeholder="What notice are you publishing?"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Notice Kill Timing (Expiration Preset)</label>
                <div className="d-flex flex-wrap gap-2 mb-2">
                  {[
                    { label: '1 Hour', hours: 1 },
                    { label: '6 Hours', hours: 6 },
                    { label: '12 Hours', hours: 12 },
                    { label: '1 Day', hours: 24 },
                    { label: '3 Days', hours: 72 },
                    { label: '7 Days', hours: 168 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className={`btn btn-sm ${activePreset === preset.hours ? 'btn-primary' : 'btn-outline-secondary text-white'}`}
                      style={{
                        background: activePreset === preset.hours ? '' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      onClick={() => setPresetTime(preset.hours)}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <label className="form-label small text-white-50 mt-2">Custom Kill Time</label>
                <input
                  type="datetime-local"
                  name="tillTime"
                  value={postData.tillTime}
                  onChange={handleChange}
                  min={minDatetime}
                  max={maxDatetime}
                  className="form-control premium-input"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-white-50">Image (optional)</label>
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
                    alt="Preview" 
                    className="img-fluid rounded border border-secondary"
                    style={{ maxHeight: '150px', objectFit: 'cover' }}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-premium-primary w-100 fw-bold"
              >
                Publish Notice
              </button>
            </form>
          </div>
        ) : (
          <div className="card premium-card p-4 text-center" style={{ width: '100%', maxWidth: '400px' }}>
            <h5 className="mb-2 text-white">You are not logged in</h5>
            <p className="text-white-50 small mb-3">Please login to create a post</p>
            <button
              className="btn btn-premium-primary w-100 fw-bold"
              onClick={() => navigate('/warden/login')}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default WardenCreatePost
