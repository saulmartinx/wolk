import React, { useState, useEffect } from 'react';
import './App.css';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

// Pi Coin Icon Component
const PiCoinIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#FFC107" stroke="#FF9800" strokeWidth="2"/>
    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">π</text>
  </svg>
);

// Job Card Component
const JobCard = ({ job, onSwipe, onPayment, isTop, piUser }) => {
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
      const action = dragOffset.x > 0 ? 'accept' : 'reject';
      if (action === 'accept' && piUser) {
        onPayment(job);
      } else {
        onSwipe(job.id, action);
      }
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
        ✓ ACCEPT & PAY
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
  const [piUser, setPiUser] = useState(null);
  const [piInitialized, setPiInitialized] = useState(false);

  useEffect(() => {
    initializePi();
    fetchJobs();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchJobs();
    }
  }, [selectedCategory]);

  const initializePi = () => {
    if (window.Pi) {
      window.Pi.init({ 
        version: "2.0", 
        sandbox: true // Use testnet for development
      });
      setPiInitialized(true);
      console.log("✅ Pi SDK initialized");
    } else {
      console.warn("⚠️ Pi SDK not loaded");
      // For development, we'll continue without Pi SDK
      setPiInitialized(false);
    }
  };

  const authenticatePiUser = async () => {
    if (!window.Pi || !piInitialized) {
      setMessage("Pi SDK not available. Using demo mode.");
      return;
    }

    try {
      const scopes = ['username', 'payments'];
      
      const onIncompletePayment = async (payment) => {
        console.log("Handling incomplete payment:", payment);
        try {
          await fetch(`${API_URL}/api/payments/incomplete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment)
          });
        } catch (error) {
          console.error("Error handling incomplete payment:", error);
        }
      };

      const authResult = await window.Pi.authenticate(scopes, onIncompletePayment);
      
      // Send authentication data to backend
      await fetch(`${API_URL}/api/pi/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authResult.user)
      });

      setPiUser(authResult.user);
      setMessage(`Welcome to Wolk, ${authResult.user.username}! 🎉`);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Pi authentication failed:', error);
      setMessage('Authentication failed. Using demo mode.');
    }
  };

  const initiatePayment = async (job) => {
    if (!window.Pi || !piUser) {
      setMessage("Pi payment not available. Using demo mode.");
      setTimeout(() => setMessage(''), 3000);
      handleSwipe(job.id, 'accept');
      return;
    }

    try {
      const paymentData = {
        amount: job.payment,
        memo: `Payment for ${job.title} on Wolk`,
        metadata: { 
          jobId: job.id,
          jobTitle: job.title,
          employer: job.employer 
        }
      };

      const paymentCallbacks = {
        onReadyForServerApproval: async (paymentId) => {
          console.log("Payment ready for approval:", paymentId);
          try {
            await fetch(`${API_URL}/api/payments/approve`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId })
            });
          } catch (error) {
            console.error("Payment approval failed:", error);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log("Payment ready for completion:", paymentId, txid);
          try {
            const response = await fetch(`${API_URL}/api/payments/complete`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ paymentId, txid })
            });
            
            const result = await response.json();
            setMessage(`🎉 Payment completed! ${result.amount} Pi sent to ${job.employer}`);
            setCurrentJobIndex(prevIndex => prevIndex + 1);
          } catch (error) {
            console.error("Payment completion failed:", error);
            setMessage("Payment processing error. Please try again.");
          }
        },
        onCancel: () => {
          setMessage("Payment cancelled");
          setTimeout(() => setMessage(''), 3000);
        },
        onError: (error) => {
          console.error("Payment error:", error);
          setMessage("Payment error. Please try again.");
          setTimeout(() => setMessage(''), 3000);
        }
      };

      await window.Pi.createPayment(paymentData, paymentCallbacks);
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setMessage('Payment failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

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
          user_id: piUser?.uid || 'demo_user',
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
      const currentJob = jobs[currentJobIndex];
      if (action === 'accept' && piUser) {
        initiatePayment(currentJob);
      } else {
        handleSwipe(currentJob.id, action);
      }
    }
  };

  const currentJob = jobs[currentJobIndex];
  const nextJob = jobs[currentJobIndex + 1];

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">
          <PiCoinIcon size={48} />
          <p>Loading Wolk jobs...</p>
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
          <span>Wolk</span>
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
        
        <button 
          className="profile-btn" 
          onClick={piUser ? () => setMessage(`Logged in as ${piUser.username}`) : authenticatePiUser}
        >
          {piUser ? piUser.username[0].toUpperCase() : '🔐'}
        </button>
      </header>

      {/* Pi Authentication Banner */}
      {!piUser && (
        <div className="auth-banner">
          <p>Connect your Pi wallet to make real payments!</p>
          <button onClick={authenticatePiUser} className="auth-btn">
            Connect Pi Wallet
          </button>
        </div>
      )}

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
                onPayment={initiatePayment}
                isTop={false}
                piUser={piUser}
              />
            )}
            {currentJob && (
              <JobCard
                job={currentJob}
                onSwipe={handleSwipe}
                onPayment={initiatePayment}
                isTop={true}
                piUser={piUser}
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
            {piUser ? '✓ Accept & Pay' : '✓ Accept'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;