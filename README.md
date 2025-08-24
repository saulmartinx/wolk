# 🚀 Wolk - The Pi Network Job Marketplace

**A decentralized job marketplace with Tinder-like swipe interface, powered by Pi Coin payments**

![Wolk Banner](https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxlbXBsb3ltZW50fGVufDB8fHx8MTc1Mjc1ODYwOXww&ixlib=rb-4.1.0&q=85&w=1200&h=400)

## ✨ Overview

Wolk revolutionizes job discovery by combining the intuitive swipe mechanics of modern dating apps with the power of blockchain payments. Built on the Pi Network ecosystem, Wolk enables seamless job transactions using Pi Coin cryptocurrency.

### 🎯 Key Features

- **🔄 Tinder-like Job Browsing** - Swipe right to accept, left to reject jobs
- **💰 Real Pi Coin Payments** - Integrated with Pi Network for authentic cryptocurrency transactions
- **🔐 Pi Wallet Authentication** - Secure user authentication through Pi Network
- **📱 Mobile-First Design** - Optimized for smartphones and tablets
- **🏷️ Smart Job Filtering** - Browse jobs by category (Tech, Manual Labor, Consulting, etc.)
- **⭐ Employer Ratings** - Transparent feedback system for job providers
- **🔗 Blockchain Security** - Smart contracts ensure payment transparency

## 🛠️ Technology Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Pi Network SDK** - Real Pi Coin integration
- **Responsive Design** - Mobile-optimized interface

### Backend  
- **FastAPI** - High-performance Python web framework
- **MongoDB** - NoSQL database for job and user data
- **Pi Network API** - Blockchain payment processing
- **Motor** - Async MongoDB driver

### Blockchain Integration
- **Pi Network Testnet** - Safe development environment
- **Pi Coin Payments** - Real cryptocurrency transactions
- **Smart Contracts** - Automated payment escrow

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+
- MongoDB
- Pi Network Developer Account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wolk-pi-marketplace.git
   cd wolk-pi-marketplace
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Configure environment variables
   cp .env.example .env
   # Add your Pi Network credentials to .env
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   yarn install
   # or npm install
   ```

4. **Database Setup**
   ```bash
   # Ensure MongoDB is running
   mongod
   ```

5. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   python server.py
   
   # Terminal 2 - Frontend  
   cd frontend
   yarn start
   ```

## 🔑 Pi Network Configuration

### Getting Pi Network Credentials

1. **Install Pi Apps**
   - Download Pi Mining App from your app store
   - Install Pi Browser

2. **Register Your App**
   - Open Pi App → Menu → Pi Utilities → Develop
   - Click "New App" and fill in details:
     - **App Name:** Wolk
     - **Description:** Decentralized job marketplace
     - **Network:** Pi Testnet (for development)

3. **Get Credentials**
   - **API Key:** From Developer Portal → API Key section
   - **App ID:** Your registered app identifier  
   - **Wallet Key:** Generated in App Wallet section

4. **Configure Environment**
   ```bash
   # backend/.env
   PI_API_KEY=your_pi_api_key_here
   PI_APP_ID=your_app_id_here  
   PI_WALLET_KEY=your_wallet_key_here
   MONGO_URL=mongodb://localhost:27017
   ```

## 📱 Usage

### For Job Seekers

1. **Connect Pi Wallet**
   - Click "Connect Pi Wallet" in the app
   - Authenticate through Pi Network

2. **Browse Jobs**
   - Swipe through job cards
   - Filter by category using the dropdown
   - View job details, payments, and employer ratings

3. **Accept Jobs**
   - Swipe right or click "Accept & Pay"
   - Authorize Pi Coin payment through Pi wallet
   - Receive confirmation once payment is processed

### For Employers

1. **Post Jobs** *(Coming Soon)*
   - Create detailed job listings
   - Set Pi Coin payment amounts
   - Add deadlines and requirements

2. **Manage Applications**
   - Review job applicants
   - Process payments automatically
   - Rate completed work

## 🔗 API Documentation

### Authentication Endpoints

```javascript
// Pi User Authentication
POST /api/pi/auth
{
  "uid": "user_pi_id",
  "username": "pi_username", 
  "access_token": "pi_access_token"
}
```

### Job Endpoints

```javascript
// Get all jobs
GET /api/jobs?category=Technology&limit=10

// Get single job
GET /api/jobs/{job_id}

// Record swipe action
POST /api/swipe
{
  "job_id": "job_uuid",
  "user_id": "pi_user_id", 
  "action": "accept" // or "reject"
}
```

### Payment Endpoints

```javascript
// Approve payment
POST /api/payments/approve
{
  "paymentId": "pi_payment_id"
}

// Complete payment
POST /api/payments/complete  
{
  "paymentId": "pi_payment_id",
  "txid": "blockchain_transaction_id"
}

// Get transaction history
GET /api/transactions?limit=50
```

## 🎨 Screenshots

### Main Interface
- **Job Cards:** Beautiful cards with job details and Pi Coin payments
- **Swipe Mechanics:** Visual indicators for accept/reject actions
- **Category Filtering:** Easy job filtering by type

### Pi Integration  
- **Wallet Connection:** Seamless Pi Network authentication
- **Payment Flow:** Real-time payment processing
- **Transaction History:** Complete blockchain transaction records

## 🧪 Development

### Testing

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests  
cd frontend
yarn test

# API testing
python backend_test.py
```

### Database Schema

```javascript
// Jobs Collection
{
  id: String,
  title: String,
  description: String, 
  payment: Number, // Pi Coin amount
  location: String,
  employer: String,
  employer_rating: Number,
  category: String,
  deadline: String,
  created_at: String
}

// Transactions Collection
{
  payment_id: String, // Pi Network payment ID
  txid: String, // Blockchain transaction ID  
  amount: Number,
  job_id: String,
  status: String, // 'pending', 'completed', 'failed'
  created_at: String
}
```

## 🚀 Deployment

### Production Setup

1. **Switch to Pi Mainnet**
   ```javascript
   // Remove sandbox mode
   Pi.init({ version: "2.0" }); // Remove sandbox: true
   ```

2. **Environment Variables**
   ```bash
   PI_API_KEY=production_api_key
   PI_APP_ID=production_app_id
   NODE_ENV=production
   ```

3. **Security Considerations**
   - Use HTTPS for all Pi Network communication
   - Implement rate limiting
   - Add input validation and sanitization
   - Set up proper error logging

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests  
4. Ensure all tests pass: `yarn test`
5. Submit a pull request

### Code Standards

- **Frontend:** ESLint + Prettier configuration
- **Backend:** Black + Flake8 for Python formatting
- **Commits:** Conventional commit messages
- **Testing:** Minimum 80% code coverage

## 📋 Roadmap

### Phase 1: Core Marketplace ✅
- [x] Tinder-like job browsing
- [x] Pi Network integration  
- [x] Real Pi Coin payments
- [x] Mobile-responsive design

### Phase 2: Enhanced Features 🔄
- [ ] Job posting interface for employers
- [ ] Advanced search and filters
- [ ] User profiles and portfolios
- [ ] In-app messaging system

### Phase 3: Advanced Integration 📋
- [ ] Smart contract escrow
- [ ] Reputation system
- [ ] Multi-language support
- [ ] Push notifications

## 🔒 Security

- **Pi Network Integration:** Secure API key management
- **Payment Processing:** Blockchain-verified transactions
- **Data Protection:** Encrypted user data storage
- **Access Control:** Pi Network user authentication

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

### Getting Help

- **Documentation:** Check our [Wiki](https://github.com/yourusername/wolk/wiki)
- **Issues:** Create a [GitHub Issue](https://github.com/yourusername/wolk/issues)
- **Discord:** Join our [community server](https://discord.gg/wolk)

### Pi Network Resources

- [Pi Network Developer Guide](https://pi-apps.github.io/community-developer-guide/)
- [Pi Platform APIs](https://pi-apps.github.io/community-developer-guide/docs/gettingStarted/piAppPlatform/piAppPlatformAPIs/)
- [Pi SDK Documentation](https://github.com/pi-apps/pi-platform-docs)

---

**Built with ❤️ for the Pi Network community**

*Wolk - Where jobs meet blockchain innovation* 🚀💰
