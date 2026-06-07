import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const WardenPostStatusCard = ({ post }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(post?.status || "");
  const [tillTime, setTillTime] = useState(() => {
    if (post?.tillTime) {
      const date = new Date(post.tillTime);
      const pad = (num) => String(num).padStart(2, '0');
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
    return "";
  });
  const [activePreset, setActivePreset] = useState(null);

  const setPresetTime = (hours) => {
    setActivePreset(hours);
    const date = new Date();
    date.setHours(date.getHours() + hours);
    
    const pad = (num) => String(num).padStart(2, '0');
    const localDatetime = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    
    setTillTime(localDatetime);
  };

  if (!post) return <p className="text-center text-light py-5">Loading...</p>;

  const nowTime = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const pad = (num) => String(num).padStart(2, '0');
  const formatDatetime = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };
  const minDatetime = formatDatetime(nowTime);
  const maxDatetime = formatDatetime(oneMonthLater);

  return (
    <div className="card bg-dark text-light border border-secondary shadow-lg mb-4">
      {/* Card Header */}
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Post Review</h5>
        <span className="badge bg-secondary text-light">
          Current: {post.status || "Pending"}
        </span>
      </div>

      <div className="card-body">
        {/* Student Info */}
        <div className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom border-secondary">
          {post.createdBy?.photo ? (
            <img 
              src={post.createdBy.photo} 
              alt="Hostel ID Card" 
              className="rounded border border-secondary shadow-sm"
              style={{ width: '130px', height: '85px', objectFit: 'cover' }}
            />
          ) : (
            <div className="rounded border border-secondary d-flex align-items-center justify-content-center bg-secondary" style={{ width: '130px', height: '85px', fontSize: '2rem' }}>
              🪪
            </div>
          )}
          <div>
            <small className="text-secondary d-block">Student Info</small>
            <span className="fw-bold fs-5 text-white">{post.createdBy.name}</span>
            <p className="text-white-50 mb-0 small mt-1">
              🚪 Room: {post.roomNumber || "N/A"} | Roll No: {post.createdBy?.rollNumber || "N/A"}
            </p>
          </div>
        </div>

        {/* Category */}
        <div className="mb-3">
          <small className="text-secondary">Category</small>
          <p className="mb-0">
            <span className="badge bg-secondary">{post.category || "General"}</span>
          </p>
        </div>

        {/* Full Description */}
        <div className="mb-4">
          <small className="text-secondary">Content</small>
          <p className="mt-1">{post.content}</p>
        </div>

        {/* Attachment Image */}
        {post.image && (
          <div className="mb-4">
            <small className="text-secondary d-block mb-1">Problem Image</small>
            <div className="text-center bg-dark p-2 rounded border border-secondary">
              <img 
                src={post.image} 
                alt="Problem Attachment" 
                className="img-fluid rounded" 
                style={{ maxHeight: '280px', objectFit: 'contain', maxWidth: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Status Update Form */}
        <form onSubmit={async (e) => {
          e.preventDefault();

          let tillDate = null;
          if (tillTime) {
            tillDate = new Date(tillTime);
            const now = new Date();
            if (tillDate <= now) {
              alert("Please select a future date and time for expiration!");
              return;
            }

            const maxLimit = new Date();
            maxLimit.setMonth(maxLimit.getMonth() + 1);
            if (tillDate > maxLimit) {
              alert("Notice duration cannot exceed one month from the present time!");
              return;
            }
          }

          try {
            const res = await axios.patch(
              `${API_BASE_URL}/warden/updateStatus/post/${post._id}`,
              { status, tillTime: tillDate },
              { withCredentials: true }
            );
            console.log(res.data);
            navigate("/");
          } catch (err) {
            console.error(err);
            alert("Failed to update status: " + (err.response?.data || err.message));
          }
        }}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-white-50">Update Status</label>
            <select
              className="form-select bg-secondary text-light border-0"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="">Select new status</option>
              <option value="Pending">Pending</option>
              <option value="Seen">Seen</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label small text-white-50">Notice Expiration Preset</label>
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

            <label className="form-label small text-white-50 mt-2">Custom Expiration Time</label>
            <input
              type="datetime-local"
              value={tillTime}
              onChange={(e) => {
                setActivePreset(null);
                setTillTime(e.target.value);
              }}
              min={minDatetime}
              max={maxDatetime}
              className="form-control bg-secondary text-light border-0"
            />
          </div>

          <div className="d-grid mt-4">
            <button type="submit" className="btn btn-success w-100">
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WardenPostStatusCard;
