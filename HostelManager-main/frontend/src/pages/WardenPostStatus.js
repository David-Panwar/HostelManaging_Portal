import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import WardenPostStatusCard from '../components/WardenPostStatusCard'
import { API_BASE_URL } from '../config'

function WardenPostStatus() {
  const params = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const getSinglePost = async () => {
      const res = await axios.get(`${API_BASE_URL}/post/${params.id}`, {
        withCredentials: true
      })
      setPost(res.data)
    }

    getSinglePost()
  }, [params.id])

  return (
    <div className="container-fluid bg-dark text-light min-vh-100 py-4">

      {/* Header */}
      <div className="container mb-4">
        <div className="d-flex justify-content-between align-items-center border-bottom border-secondary pb-3">
          <div>
            <h3 className="fw-semibold mb-1">Post Review</h3>
            <p className="text-secondary mb-0">
              Warden / Admin Control Panel
            </p>
          </div>

          <span className="badge bg-secondary text-light px-3 py-2">
            ID: {params.id}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">

            {post ? (
              <WardenPostStatusCard post={post} />
            ) : (
              <div className="card bg-black border border-secondary shadow-lg text-center p-5">
                <div className="spinner-border text-light mb-3"></div>
                <p className="mb-0 text-secondary">
                  Loading post details...
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  )
}

export default WardenPostStatus
