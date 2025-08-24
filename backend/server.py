from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime
import requests
import json

app = FastAPI(title="Wolk API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(MONGO_URL)
db = client.wolk_db
jobs_collection = db.jobs
users_collection = db.users
transactions_collection = db.transactions

# Pi Network Configuration
PI_API_KEY = os.environ.get('PI_API_KEY')
PI_APP_ID = os.environ.get('PI_APP_ID')
PI_WALLET_KEY = os.environ.get('PI_WALLET_KEY')

# Pydantic models
class Job(BaseModel):
    id: str
    title: str
    description: str
    payment: float
    location: str
    employer: str
    employer_rating: float
    category: str
    image_url: str
    deadline: str
    created_at: str

class PiUser(BaseModel):
    uid: str
    username: str
    access_token: str

class PiPayment(BaseModel):
    amount: float
    memo: str
    metadata: Dict[str, Any]

class PaymentApproval(BaseModel):
    paymentId: str

class PaymentCompletion(BaseModel):
    paymentId: str
    txid: str

class SwipeAction(BaseModel):
    job_id: str
    user_id: str
    action: str  # "accept" or "reject"

# Pi API verification
def verify_pi_payment(payment_id: str):
    """Verify payment with Pi Network servers"""
    try:
        url = f"https://api.minepi.com/v2/payments/{payment_id}"
        headers = {"Authorization": f"Key {PI_API_KEY}"}
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(f"Error verifying payment: {e}")
        return None

# Sample job data with Wolk branding
sample_jobs = [
    {
        "id": str(uuid.uuid4()),
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
        "id": str(uuid.uuid4()),
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
        "id": str(uuid.uuid4()),
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
        "id": str(uuid.uuid4()),
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
        "id": str(uuid.uuid4()),
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
]

@app.on_event("startup")
async def startup_event():
    # Initialize database with sample data
    existing_jobs = await jobs_collection.count_documents({})
    if existing_jobs == 0:
        await jobs_collection.insert_many(sample_jobs)
        print("✅ Sample jobs inserted into Wolk database")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Wolk API", "pi_integration": "enabled"}

@app.post("/api/pi/auth")
async def authenticate_pi_user(user: PiUser):
    """Store Pi user authentication data"""
    try:
        # Store user in database
        user_data = {
            "pi_uid": user.uid,
            "username": user.username,
            "access_token": user.access_token,
            "created_at": datetime.now().isoformat(),
            "last_login": datetime.now().isoformat()
        }
        
        # Update or insert user
        await users_collection.update_one(
            {"pi_uid": user.uid},
            {"$set": user_data},
            upsert=True
        )
        
        print(f"✅ Pi user authenticated: {user.username}")
        return {"status": "success", "message": "User authenticated successfully"}
    
    except Exception as e:
        print(f"❌ Error authenticating user: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@app.post("/api/payments/approve")
async def approve_payment(approval: PaymentApproval):
    """Approve payment with Pi Network"""
    try:
        url = "https://api.minepi.com/v2/payments/approve"
        headers = {
            "Authorization": f"Key {PI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {"paymentId": approval.paymentId}
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            # Store pending payment in database
            payment_record = {
                "payment_id": approval.paymentId,
                "status": "approved",
                "created_at": datetime.now().isoformat()
            }
            await transactions_collection.insert_one(payment_record)
            
            print(f"✅ Payment approved: {approval.paymentId}")
            return {"status": "success", "message": "Payment approved"}
        else:
            print(f"❌ Payment approval failed: {response.text}")
            raise HTTPException(status_code=400, detail="Payment approval failed")
    
    except Exception as e:
        print(f"❌ Error approving payment: {e}")
        raise HTTPException(status_code=500, detail="Payment approval error")

@app.post("/api/payments/complete")
async def complete_payment(completion: PaymentCompletion):
    """Complete payment verification"""
    try:
        # Verify payment with Pi Network
        payment_data = verify_pi_payment(completion.paymentId)
        
        if not payment_data:
            raise HTTPException(status_code=400, detail="Payment verification failed")
        
        # Update transaction in database
        transaction_update = {
            "payment_id": completion.paymentId,
            "txid": completion.txid,
            "amount": payment_data.get("amount", 0),
            "status": "completed",
            "completed_at": datetime.now().isoformat(),
            "pi_data": payment_data
        }
        
        await transactions_collection.update_one(
            {"payment_id": completion.paymentId},
            {"$set": transaction_update},
            upsert=True
        )
        
        print(f"✅ Payment completed: {completion.paymentId}")
        return {
            "status": "success", 
            "message": "Payment completed successfully",
            "txid": completion.txid,
            "amount": payment_data.get("amount", 0)
        }
    
    except Exception as e:
        print(f"❌ Error completing payment: {e}")
        raise HTTPException(status_code=500, detail="Payment completion error")

@app.post("/api/payments/incomplete")
async def handle_incomplete_payment(payment_data: dict):
    """Handle incomplete payments during authentication"""
    try:
        payment_id = payment_data.get("identifier")
        
        # Check if payment exists and is completed
        existing = await transactions_collection.find_one({"payment_id": payment_id})
        
        if existing and existing.get("status") == "completed":
            return {"action": "ignore", "message": "Payment already completed"}
        
        # If payment is still pending, try to complete it
        if payment_data.get("status") == "pending":
            txid = payment_data.get("transaction", {}).get("txid")
            if txid:
                completion = PaymentCompletion(paymentId=payment_id, txid=txid)
                await complete_payment(completion)
                return {"action": "completed", "message": "Payment completed"}
        
        print(f"📋 Handled incomplete payment: {payment_id}")
        return {"action": "processed", "message": "Payment processed"}
    
    except Exception as e:
        print(f"❌ Error handling incomplete payment: {e}")
        return {"action": "error", "message": str(e)}

@app.get("/api/jobs", response_model=List[Job])
async def get_jobs(category: Optional[str] = None, limit: int = 10):
    try:
        query = {}
        if category:
            query["category"] = category
        
        jobs_cursor = jobs_collection.find(query).limit(limit)
        jobs = []
        async for job in jobs_cursor:
            job["_id"] = str(job["_id"])
            jobs.append(job)
        
        return jobs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    try:
        job = await jobs_collection.find_one({"id": job_id})
        if not job:
            raise HTTPException(status_code=404, detail="Job not found")
        
        job["_id"] = str(job["_id"])
        return job
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/swipe")
async def record_swipe(swipe_action: SwipeAction):
    try:
        action_record = {
            "id": str(uuid.uuid4()),
            "job_id": swipe_action.job_id,
            "user_id": swipe_action.user_id,
            "action": swipe_action.action,
            "timestamp": datetime.now().isoformat()
        }
        
        print(f"📱 Wolk swipe recorded: {swipe_action.action} for job {swipe_action.job_id}")
        
        if swipe_action.action == "accept":
            return {"message": "Job accepted! Ready to initiate Pi payment.", "match": True, "requires_payment": True}
        else:
            return {"message": "Job rejected", "match": False, "requires_payment": False}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories")
async def get_categories():
    try:
        categories = await jobs_collection.distinct("category")
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/transactions")
async def get_transactions(limit: int = 50):
    """Get transaction history"""
    try:
        transactions_cursor = transactions_collection.find().limit(limit).sort("created_at", -1)
        transactions = []
        async for tx in transactions_cursor:
            tx["_id"] = str(tx["_id"])
            transactions.append(tx)
        
        return {"transactions": transactions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)