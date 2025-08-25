import React, { useState, useEffect } from 'react';
import './App.css';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';

// For GitHub Pages deployment, we'll use mock data since we don't have a live backend
const mockJobs = [
  {
    "id": "job-1",
    "title": "Chop Firewood",
    "description": "Need someone to chop firewood for winter. Urgently need assistance! Must be physically fit and have experience with axes.",
    "payment": 50.0,
    "location": "Tallinn, Estonia",
    "employer": "John Smith",
    "employer_rating": 4.8,
    "category": "Manual Labor",
    "image_url": "https://images.unsplash.com/photo-1675134768072-d700f38ceef0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHx3b3JrJTIwam9ic3xlbnwwfHx8fDE3NTI3NTg2MDF8MA&ixlib=rb-4.1.0&q=85",
    "deadline": "2025-03-20",
    "created_at": "2025-03-15"
  },
  {
    "id": "job-2",
    "title": "Office Cleaning",
    "description": "Looking for reliable cleaner for small office space. Daily cleaning required, flexible hours available.",
    "payment": 35.0,
    "location": "Riga, Latvia",
    "employer": "Clean Solutions Ltd",
    "employer_rating": 4.6,
    "category": "Cleaning",
    "image_url": "https://images.unsplash.com/photo-1741543821138-471a53f147f2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHx3b3JrJTIwam9ic3xlbnwwfHx8fDE3NTI3NTg2MDF8MA&ixlib=rb-4.1.0&q=85",
    "deadline": "2025-03-25",
    "created_at": "2025-03-14"
  },
  {
    "id": "job-3",
    "title": "Website Development",
    "description": "Need a simple website for my restaurant. Looking for someone with React and modern web development skills.",
    "payment": 120.0,
    "location": "Helsinki, Finland",
    "employer": "Maria Andersson",
    "employer_rating": 4.9,
    "category": "Technology",
    "image_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxlbXBsb3ltZW50fGVufDB8fHx8MTc1Mjc1ODYwOXww&ixlib=rb-4.1.0&q=85",
    "deadline": "2025-03-30",
    "created_at": "2025-03-13"
  },
  {
    "id": "job-4",
    "title": "Document Translation",
    "description": "Need someone to translate business documents from English to Estonian. Must have professional translation experience.",
    "payment": 80.0,
    "location": "Tartu, Estonia",
    "employer": "Baltic Business Corp",
    "employer_rating": 4.7,
    "category": "Professional Services",
    "image_url": "https://images.unsplash.com/photo-1562564055-71e051d33c19?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxlbXBsb3ltZW50fGVufDB8fHx8MTc1Mjc1ODYwOXww&ixlib=rb-4.1.0&q=85",
    "deadline": "2025-03-22",
    "created_at": "2025-03-12"
  },
  {
    "id": "job-5",
    "title": "Marketing Consultation",
    "description": "Small startup needs marketing strategy consultation. Looking for someone with digital marketing experience.",
    "payment": 95.0,
    "location": "Stockholm, Sweden",
    "employer": "Nordic Innovations",
    "employer_rating": 4.5,
    "category": "Consulting",
    "image_url": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxlbXBsb3ltZW50fGVufDB8fHx8MTc1Mjc1ODYwOXww&ixlib=rb-4.1.0&q=85",
    "deadline": "2025-03-28",
    "created_at": "2025-03-11"
  }
];

const mockCategories = ['All', 'Manual Labor', 'Cleaning', 'Technology', 'Professional Services', 'Consulting'];

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
  const [jobs, setJobs] = useState(mockJobs);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [piUser, setPiUser] = useState(null);
  const [piInitialized, setPiInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Check for URL-based page routing
  useEffect(() => {
    const path = window.location.hash || window.location.pathname;
    if (path.includes('privacy')) {
      setCurrentPage('privacy');
    } else if (path.includes('terms')) {
      setCurrentPage('terms');
    } else {
      setCurrentPage('home');
    }
  }, []);

  useEffect(() => {
    initializePi();
    filterJobs();
  }, [selectedCategory]);

  // Render different pages based on currentPage
  if (currentPage === 'privacy') {
    return <PrivacyPolicy />;
  }
  
  if (currentPage === 'terms') {
    return <TermsOfService />;
  }

  const initializePi = () => {
    if (window.Pi) {
      window.Pi.init({ 
        version: "2.0", 
        sandbox: true // Use testnet for development
      });
      setPiInitialized(true);
      console.log("✅ Pi SDK initialized");
    } else {
      console.warn("⚠️ Pi SDK not loaded - using demo mode");
      setPiInitialized(false);
    }
  };

  const authenticatePiUser = async () => {
    if (!window.Pi || !piInitialized) {
      setMessage("Pi SDK not available. Demo mode - showing Wolk interface!");
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const scopes = ['username', 'payments'];
      
      const onIncompletePayment = async (payment) => {
        console.log("Handling incomplete payment:", payment);
        setMessage("Handling incomplete payment...");
        setTimeout(() => setMessage(''), 3000);
      };

      const authResult = await window.Pi.authenticate(scopes, onIncompletePayment);
      setPiUser(authResult.user);
      setMessage(`Welcome to Wolk, ${authResult.user.username}! 🎉`);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Pi authentication failed:', error);
      setMessage('Authentication failed. Using demo mode.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const initiatePayment = async (job) => {
    if (!window.Pi || !piUser) {
      setMessage("🎉 Demo Payment: Would pay " + job.payment + " Pi Coins to " + job.employer);
      setTimeout(() => setMessage(''), 3000);
      setCurrentJobIndex(prevIndex => prevIndex + 1);
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
          setMessage("Payment being processed...");
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log("Payment ready for completion:", paymentId, txid);
          setMessage(`🎉 Payment completed! ${job.payment} Pi sent to ${job.employer}`);
          setCurrentJobIndex(prevIndex => prevIndex + 1);
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

  const filterJobs = () => {
    if (selectedCategory === 'All') {
      setJobs(mockJobs);
    } else {
      setJobs(mockJobs.filter(job => job.category === selectedCategory));
    }
    setCurrentJobIndex(0);
  };

  const handleSwipe = async (jobId, action) => {
    try {
      console.log(`Swipe recorded: ${action} for job ${jobId}`);
      
      if (action === 'accept') {
        setMessage("Job accepted! In production, this would initiate Pi payment.");
      } else {
        setMessage("Job rejected");
      }
      
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
      } else if (action === 'accept') {
        setMessage(`Demo: Would pay ${currentJob.payment} Pi Coins for "${currentJob.title}"`);
        setTimeout(() => setMessage(''), 3000);
        setCurrentJobIndex(prevIndex => prevIndex + 1);
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
            <button onClick={filterJobs} className="refresh-btn">
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

      {/* Footer Links */}
      <footer className="app-footer">
        <div className="footer-links">
          <button onClick={() => setCurrentPage('privacy')} className="footer-link">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setCurrentPage('terms')} className="footer-link">Terms of Service</button>
          <span>•</span>
          <a href="https://github.com/saulmartinx/wolk" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default App;