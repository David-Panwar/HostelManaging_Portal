import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function Notice({ data }) {
  const [timeLeft, setTimeLeft] = useState('');

  const role = JSON.parse(localStorage.getItem("role"));
  const isWarden = role === 'warden';

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      try {
        await axios.delete(`${API_BASE_URL}/post/${data._id}`, { withCredentials: true });
        window.location.reload();
      } catch (err) {
        alert("Failed to delete notice: " + (err.response?.data || err.message));
      }
    }
  };

  useEffect(() => {
    const targetTime = new Date(data.tillTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft('00:00:00');
      } else {
        const totalSeconds = Math.floor(diff / 1000);

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
    <div className="card w-100 mb-3 premium-card" 
         style={{ 
           borderLeft: '4px solid #ff9f43',
           background: 'rgba(255, 159, 67, 0.03)',
           boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
         }}>
      <div className="card-body">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-bold text-white mb-0" style={{ letterSpacing: '0.5px' }}>
            📢 OFFICIAL NOTICE
          </h6>
          <span className="text-secondary small" style={{ fontSize: '0.75rem' }}>
            by {data.createdBy?.name || 'Warden'}
          </span>
        </div>

        {/* Content */}
        <p className="card-text text-light mb-3" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
          {data.content}
        </p>

        {data.image && (
          <div className="mb-3 text-center">
            <img 
              src={data.image} 
              alt="Attachment" 
              className="img-fluid rounded border border-secondary"
              style={{ maxHeight: '140px', objectFit: 'cover', width: '100%' }}
            />
          </div>
        )}

        {/* Footer info: Timer and Delete */}
        <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary">
          <span className="small text-warning-emphasis d-flex align-items-center gap-1" style={{ fontSize: '0.8rem' }}>
            ⏳ Expiry: <strong className="text-warning">{timeLeft}</strong>
          </span>

          {isWarden && (
            <button 
              className="btn btn-danger btn-sm py-1 px-3 fw-bold" 
              style={{ fontSize: '0.8rem' }}
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notice;
