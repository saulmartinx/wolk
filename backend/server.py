from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from motor.motor_asyncio import AsyncIOMotorClient
import uuid
from datetime import datetime

app = FastAPI(title="Pi Work API", version="1.0.0")

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
db = client.piwork_db
jobs_collection = db.jobs
users_collection = db.users

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

class User(BaseModel):
    id: str
    name: str
    email: str
    profile_image: str
    rating: float
    jobs_completed: int

class SwipeAction(BaseModel):
    job_id: str
    user_id: str
    action: str  # "accept" or "reject"

# Sample job data
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
        print("✅ Sample jobs inserted into database")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "Pi Work API"}

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
        # In a real app, this would record the swipe action and handle matching
        # For now, we'll just return success
        action_record = {
            "id": str(uuid.uuid4()),
            "job_id": swipe_action.job_id,
            "user_id": swipe_action.user_id,
            "action": swipe_action.action,
            "timestamp": datetime.now().isoformat()
        }
        
        # Log the swipe action
        print(f"📱 Swipe recorded: {swipe_action.action} for job {swipe_action.job_id}")
        
        if swipe_action.action == "accept":
            return {"message": "Job accepted! You'll be notified when employer responds.", "match": True}
        else:
            return {"message": "Job rejected", "match": False}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/categories")
async def get_categories():
    try:
        categories = await jobs_collection.distinct("category")
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)