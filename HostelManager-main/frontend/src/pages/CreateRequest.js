import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router'
import axios from 'axios'
import { Toast } from 'bootstrap'
import { API_BASE_URL } from '../config'

function CreateRequest() {
  const params = useParams()
  const userfromstore = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const toastRef = useRef(null)

  const [request, setrequest] = useState({
    createdBy: "",
    content: "",
    createdOn: params.id
  })

  useEffect(() => {
    const getSinglePost = async () => {
      const singlePost = await axios.get(
        `${API_BASE_URL}/post/${params.id}`
      )
      setPost(singlePost.data)
    }
    getSinglePost()
  }, [params.id])

  useEffect(() => {
    if (userfromstore.userid) {
      setrequest(prev => ({
        ...prev,
        createdBy: userfromstore.userid
      }))
    }
  }, [userfromstore.userid])

  const handlechange = (e) => {
    const { name, value } = e.target
    setrequest(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        `${API_BASE_URL}/request`,
        request,
       {withCredentials:true}
      )

      //  Show toast
      const toast = new Toast(toastRef.current)
      toast.show()

     
      setTimeout(() => {
        navigate('/')
      }, 1500)

    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      
      <div className="toast-container position-fixed top-0 end-0 p-3">
        <div
          ref={toastRef}
          className="toast align-items-center text-bg-success border-0"
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">
              ✅ Request submitted successfully!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
            ></button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
        <div className="container">
          {post ? (
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">

                <div className="card shadow-sm border-0 rounded-4">
                  <div className="card-body p-4">

                    <h5 className="fw-bold mb-2 text-center">
                      Request Item
                    </h5>

                    <p className="text-muted text-center small mb-4">
                      Requesting on <strong>{post.createdBy.name}</strong>'s post
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label small text-muted">
                          Your Message
                        </label>
                        <input
                          type="text"
                          name="content"
                          value={request.content}
                          onChange={handlechange}
                          className="form-control"
                          placeholder="Write your request message..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                      >
                        Send Request
                      </button>
                    </form>

                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Loading post...</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CreateRequest
