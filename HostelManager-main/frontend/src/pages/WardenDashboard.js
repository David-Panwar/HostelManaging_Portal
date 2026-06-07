import axios from 'axios'
import React, { useEffect, useState } from 'react'
import WardenPost from '../components/WardenPost'
import Notice from '../components/Notice'
import { API_BASE_URL } from '../config'

function WardenDashboard() {
  const [posts, setPosts] = useState([])
  const [activeView, setActiveView] = useState("students") 
  // students | warden

  useEffect(() => {
    const getAllPosts = async () => {
      const res = await axios.get(
        `${API_BASE_URL}/home`,
        { withCredentials: true }
      )
      setPosts(res.data)
    }
    getAllPosts()
  }, [])

  const wardenPosts = posts
    .filter(p => p.createdBy?.role === "warden")
    .sort((a, b) => b._id.localeCompare(a._id))

  const studentPosts = posts
    .filter(p => p.createdBy?.role === "student")
    .sort((a, b) => b._id.localeCompare(a._id))

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">

        {/* sidebar  */}
        <div className="col-2 bg-dark text-white p-3">
          <h5 className="mb-4 text-center">Admin Panel</h5>

          <button
            className={`btn w-100 mb-2 ${
              activeView === "students" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setActiveView("students")}
          >
            Student Posts
          </button>

          <button
            className={`btn w-100 ${
              activeView === "warden" ? "btn-primary" : "btn-outline-light"
            }`}
            onClick={() => setActiveView("warden")}
          >
            Warden Notices
          </button>
        </div>

        {/* right content  */}
        <div className="col-10 bg-light p-4 overflow-auto">
          <h4 className="mb-3">
            {activeView === "warden" ? "Warden Notices" : "Student Posts"}
          </h4>

          {(activeView === "warden" ? wardenPosts : studentPosts).length === 0 && (
            <p className="text-muted">No posts available</p>
          )}

          <div className="row g-4">
            {activeView === "warden" ? (
              wardenPosts.map(p => (
                <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex" key={p._id}>
                  <Notice data={p} />
                </div>
              ))
            ) : (
              studentPosts.map(p => (
                <WardenPost key={p._id} data={p} />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default WardenDashboard
