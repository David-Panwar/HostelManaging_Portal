import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Post({ data }) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');

  const currentUserId = JSON.parse(localStorage.getItem("userid"));
  const postCreatorId = data.createdBy?._id || data.createdBy;
  const isOwnPost = postCreatorId && currentUserId && (postCreatorId.toString() === currentUserId.toString());

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${API_BASE_URL}/post/${data._id}`, { withCredentials: true });
        window.location.reload();
      } catch (err) {
        alert("Failed to delete post: " + (err.response?.data || err.message));
      }
    }
  };

  useEffect(() => {
    if (!data.tillTime) {
      setTimeLeft('Pending Review');
      return;
    }
    const targetTime = new Date(data.tillTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        setSecondsLeft(0);
      } else {
        const totalSeconds = Math.floor(diff / 1000);
        setSecondsLeft(totalSeconds);

        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');

        setTimeLeft(`${hours}:${minutes}:${seconds}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data.tillTime]);

  return (
    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 d-flex">
      <div className="card w-100 m-2 premium-card">
        <div className="card-body d-flex flex-column">

          
          {/* Header */}

<h5 className=" me-2 card-title fw-semibold mb-1 text-white d-flex align-items-center justify-content-between w-100">
  <span>
    {data.createdBy?.name} 
    <span className="h6 mb-0 ms-2 text-secondary" style={{ fontSize: '0.8rem' }}>
      : {data.createdBy?.role}
      {data.createdBy?.role === "warden" && (
        <span className="mt-1 warden-dot"></span>
      )}
    </span>
  </span>
  {data.roomNumber && (
    <span className="badge bg-secondary text-white-50 small ms-2" style={{ fontSize: '0.75rem' }}>
      🚪 {data.roomNumber}
    </span>
  )}
</h5>



          <h6 className="card-subtitle mb-2 text-primary">
            {data.content}
          </h6>

          {data.image && (
            <div className="mb-3 text-center">
              <img 
                src={data.image} 
                alt="Problem visual" 
                className="img-fluid rounded border border-secondary"
                style={{ maxHeight: '180px', width: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          {data.conditions && (
            <p className="card-text small text-white mb-2">
              Conditions : "{data.conditions}"
            </p>
          )}

          <span
            className={`badge px-3 py-2 mb-3 align-self-start ${data.tillTime && secondsLeft <= 30 ? 'pulse' : ''}`}
            style={{
              background: !data.tillTime
                ? 'linear-gradient(135deg, #4b6cb7, #182848)'
                : secondsLeft <= 30
                  ? 'linear-gradient(135deg, #ff416c, #ff4b2b)'
                  : 'linear-gradient(135deg, #00b09b, #96c93d)',
              color: '#fff',
              borderRadius: '999px'
            }}
          >
            ⏳ {data.tillTime ? 'Post Alive : ' : 'Expiry : '} <strong>{timeLeft}</strong>
          </span>
          <div className="d-flex align-items-center justify-content-between mt-auto">
            <span 
              className="badge fw-semibold"
              style={{
                backgroundColor: data.status === "Done" ? 'rgba(40, 167, 69, 0.15)' : 'rgba(255, 193, 7, 0.15)',
                color: data.status === "Done" ? '#28a745' : '#ffc107',
                border: `1px solid ${data.status === "Done" ? 'rgba(40, 167, 69, 0.3)' : 'rgba(255, 193, 7, 0.3)'}`,
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.8rem'
              }}
            >
              {data.status || 'Pending'}
            </span>
          </div>

          {isOwnPost && (
            <button 
              className="btn btn-danger btn-sm w-100 fw-bold mt-2" 
              style={{ fontSize: '0.8rem', padding: '0.375rem 0.5rem' }}
              onClick={handleDelete}
            >
              🗑️ Delete
            </button>
          )}

        </div>

        {/* Styles */}
        <style>{`
          .card-hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            border-radius: 1rem;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            background-color: #2c2d3a;
            color: #fff;
          }
          .card-hover:hover {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.5);
          }
          .card-hover .btn-primary {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .card-hover .btn-outline-success {
            border-color: #4cd137;
            color: #4cd137;
          }
          .card-hover .btn-outline-success:hover {
            background-color: #4cd137;
            color: #fff;
          }
          .card-hover h6, .card-hover p, .card-hover .badge {
            color: #ccc;
          }
          .pulse {
            animation: pulse 1.2s infinite;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255,75,43,0.6); }
            70% { box-shadow: 0 0 0 10px rgba(255,75,43,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,75,43,0); }
          }
          /* Pulsing red dot for warden */
          .warden-dot {
            width: 12px;
            height: 12px;
            background-color: #ff4b4b;
            border-radius: 50%;
            margin-left: 0.5rem;
            animation: pulse-dot 1.2s infinite;
          }
          @keyframes pulse-dot {
            0% { box-shadow: 0 0 0 0 rgba(255,75,43,0.6); }
            70% { box-shadow: 0 0 0 6px rgba(255,75,43,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,75,43,0); }
          }
        `}</style>
      </div>
    </div>
  );
}

export default Post;
