import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Post from '../components/Post'
import WardenPost from '../components/WardenPost'
import Notice from '../components/Notice'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { API_BASE_URL } from '../config'

function Home() {
  const navigate = useNavigate()
  const [Posts, setPosts] = useState([])
  console.log(Posts)
  // const isAuth = useSelector((state) => state.auth.currentAuth)
  const isAuth = JSON.parse(localStorage.getItem("currentAuth"))
  const role = JSON.parse(localStorage.getItem("role"))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`${API_BASE_URL}/home`, 
         {withCredentials : true}
        )
        setPosts(data.data)
      } catch (err) {
        if (err.response && err.response.status === 401) {

          setTimeout(() => {
            if (role === 'warden') {
              navigate('/warden/login')
            } else {
              navigate('/login')
            }
          }, 1500);
          
          
        } else {
          console.error(err.message)
        }
      }
    }
    fetchData()
  }, [navigate, role])

  const wardenNotices = Posts.filter(post => post.createdBy?.role === 'warden')
  const sortedNotices = [...wardenNotices].sort((a, b) => b._id.localeCompare(a._id))

  const studentPosts = Posts.filter(post => post.createdBy?.role !== 'warden')
  const sortedStudentPosts = [...studentPosts].sort((a, b) => b._id.localeCompare(a._id))

  if (!isAuth) {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center"
           style={{ background: 'linear-gradient(135deg, #1e1f29 0%, #4e54c8 100%)', overflow: 'hidden' }}>
        <div className="text-center text-white">
          <h3>Please Login to see posts</h3>
          <p className="small">You need to be logged in to access the marketplace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid min-vh-100 py-4"
         style={{ background: 'radial-gradient(circle at top, #161725 0%, #0c0d12 100%)', overflowY: 'auto' }}>

      <div className="container-fluid px-md-5">
        <h2 className="text-center mb-5 fw-bold text-white">Hostel Management Portal</h2>

        <div className="row g-4">
          {/* Left Side: Warden Notice Board (sorted oldest first -> bottom to top) */}
          <div className="col-lg-4 col-md-5">
            <div className="p-4 rounded-4" 
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.02)', 
                   border: '1px solid rgba(255, 255, 255, 0.05)', 
                   backdropFilter: 'blur(10px)',
                   maxHeight: '80vh', 
                   overflowY: 'auto' 
                 }}>
              <h4 className="text-white mb-4 fw-bold d-flex align-items-center gap-2">
                <span>📢</span> Notice Board
              </h4>
              {sortedNotices.length === 0 ? (
                <p className="text-white-50 small">No active notices published yet.</p>
              ) : (
                <div className="d-flex flex-column">
                  {sortedNotices.map((notice) => (
                    <Notice key={notice._id} data={notice} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Student Complaint Posts */}
          <div className="col-lg-8 col-md-7">
            <div className="p-4 rounded-4" 
                 style={{ 
                   background: 'rgba(255, 255, 255, 0.01)', 
                   border: '1px solid rgba(255, 255, 255, 0.03)',
                   backdropFilter: 'blur(10px)',
                   maxHeight: '80vh', 
                   overflowY: 'auto' 
                 }}>
              <h4 className="text-white mb-4 fw-bold d-flex align-items-center gap-2">
                <span>🎓</span> Student Complaints
              </h4>
              {sortedStudentPosts.length === 0 ? (
                <div className="text-center mt-5 text-white">
                  <p className="mt-2 text-white-50 d-flex justify-content-center align-items-center gap-2">
                    <span className="live-dot"></span>
                    <span>No live complaints registered.</span>
                  </p>
                  <style>{`
                    .live-dot {
                      width: 10px;
                      height: 10px;
                      background: #2ecc71;
                      border-radius: 50%;
                      position: relative;
                    }
                    .live-dot::after {
                      content: '';
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      width: 10px;
                      height: 10px;
                      background: rgba(46, 204, 113, 0.6);
                      border-radius: 50%;
                      transform: translate(-50%, -50%);
                      animation: livePulse 1.5s infinite;
                    }
                    @keyframes livePulse {
                      0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                      }
                      70% {
                        transform: translate(-50%, -50%) scale(2.2);
                        opacity: 0;
                      }
                      100% {
                        opacity: 0;
                      }
                    }
                  `}</style>
                </div>
              ) : (
                <div className="row g-3">
                  {sortedStudentPosts.map((post) => (
                    role === 'warden' ? (
                      <WardenPost key={post._id} data={post} />
                    ) : (
                      <Post key={post._id} data={post} />
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home
