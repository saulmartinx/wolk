import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Pi Coin Icon Component
const PiCoinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FFC107" stroke="#FF9800" strokeWidth="2"/>
    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">π</text>
  </svg>
);

// Job Card Component
const JobCard = ({ job, onSwipe, isTop }) => {
  const [dragStart, setDragStart] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e) => {
    setDragStart({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(job.id, dragOffset.x > 0 ? 'accept' : 'reject');
    }
    
    setDragStart(null);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.6, 1 - Math.abs(dragOffset.x) / 200);

  return (
    <div 
      className={`job-card ${isTop ? 'top-card' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity: opacity
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="job-image">
        <img src={job.image_url} alt={job.title} />
        <div className="job-category">{job.category}</div>
      </div>
      
      <div className="job-content">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-description">{job.description}</p>
        
        <div className="job-payment">
          <PiCoinIcon size={24} />
          <span>{job.payment} Pi Coin</span>
        </div>
        
        <div className="job-details">
          <div className="job-location">📍 {job.location}</div>
          <div className="job-employer">
            <span>👤 {job.employer}</span>
            <span className="rating">⭐ {job.employer_rating}</span>
          </div>
          <div className="job-deadline">⏰ Deadline: {job.deadline}</div>
        </div>
      </div>
      
      {/* Swipe indicators */}
      <div className={`swipe-indicator accept ${dragOffset.x > 50 ? 'active' : ''}`}>
        ✓ ACCEPT
      </div>
      <div className={`swipe-indicator reject ${dragOffset.x < -50 ? 'active' : ''}`}>
        ✗ REJECT
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [jobs, setJobs] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchJobs();
    fetchCategories();
  }, [selectedCategory]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory === 'All' ? '' : `?category=${selectedCategory}`;
      const response = await fetch(`${API_URL}/api/jobs${categoryParam}`);
      const data = await response.json();
      setJobs(data);
      setCurrentJobIndex(0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage('Error loading jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      setCategories(['All', ...data.categories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSwipe = async (jobId, action) => {
    try {
      const response = await fetch(`${API_URL}/api/swipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          user_id: 'demo_user',
          action: action
        })
      });
      
      const result = await response.json();
      setMessage(result.message);
      
      // Move to next job
      setCurrentJobIndex(prevIndex => prevIndex + 1);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error recording swipe:', error);
      setMessage('Error processing swipe. Please try again.');
    }
  };

  const handleButtonAction = (action) => {
    if (currentJobIndex < jobs.length) {
      handleSwipe(jobs[currentJobIndex].id, action);
    }
  };

  const currentJob = jobs[currentJobIndex];
  const nextJob = jobs[currentJobIndex + 1];

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">
          <PiCoinIcon size={48} />
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="logo">
          <PiCoinIcon size={32} />
          <span>Pi Work</span>
        </div>
        
        <select 
          className="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        <button className="profile-btn">👤</button>
      </header>

      {/* Message */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* Job Cards */}
      <div className="cards-container">
        {currentJobIndex >= jobs.length ? (
          <div className="no-more-jobs">
            <PiCoinIcon size={64} />
            <h3>No more jobs available</h3>
            <p>Check back later for new opportunities!</p>
            <button onClick={fetchJobs} className="refresh-btn">
              Refresh Jobs
            </button>
          </div>
        ) : (
          <>
            {nextJob && (
              <JobCard
                job={nextJob}
                onSwipe={handleSwipe}
                isTop={false}
              />
            )}
            {currentJob && (
              <JobCard
                job={currentJob}
                onSwipe={handleSwipe}
                isTop={true}
              />
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      {currentJobIndex < jobs.length && (
        <div className="action-buttons">
          <button 
            className="reject-btn"
            onClick={() => handleButtonAction('reject')}
          >
            ✗ Reject
          </button>
          <button 
            className="accept-btn"
            onClick={() => handleButtonAction('accept')}
          >
            ✓ Accept
          </button>
        </div>
      )}
    </div>
  );
}

export default App;