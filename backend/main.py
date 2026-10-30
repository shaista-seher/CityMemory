import math
import numpy as np
from fastapi.encoders import jsonable_encoder
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, Optional
from database import supabase
from pathlib import Path
import sys
# CityMemory ML integration
ML_SRC_PATH = Path(__file__).resolve().parent / "ml" / "ml" / "src"

if str(ML_SRC_PATH) not in sys.path:
    sys.path.insert(0, str(ML_SRC_PATH))

from citymemory.integration.intelligence_service import CityMemoryIntelligence

app = FastAPI(
    title="CityMemory API",
    description="Backend API for the CityMemory platform",
    version="1.0.0"
)
# Initialize ML intelligence service
intelligence = CityMemoryIntelligence()


class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: Literal[
        "road",
        "pothole",
        "drainage",
        "streetlight",
        "water_supply",
        "waste",
        "footpath",
        "other"
    ]
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

ComplaintCreate.model_rebuild()

class ComplaintStatusUpdate(BaseModel):
    status: Literal[
        "pending",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
        "rejected"
    ]

class IntelligenceAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    complaint_text: Optional[str] = None
    radius_metres: float = 100

class IntelligenceAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    complaint_text: Optional[str] = None
    radius_metres: float = 100

# Allow our React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "message": "Welcome to CityMemory API!",
        "status": "running"
    }

@app.get("/api/health/db")
def check_database():
    try:
        result = supabase.table("assets").select("id").limit(1).execute()

        return {
            "status": "connected",
            "message": "Supabase database connected successfully!"
        }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error)
        }

@app.get("/api/assets")
def get_assets():
    try:
        result = (
            supabase.table("assets")
            .select("*")
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data),
            "assets": result.data
        }

    except Exception as error:
        return {
            "status": "error",
            "message": str(error)
        }


@app.post("/api/complaints", status_code=201)
def create_complaint(complaint: ComplaintCreate):
    try:
        complaint_data = {
            "title": complaint.title,
            "description": complaint.description,
            "category": complaint.category,
            "address": complaint.address,
            "latitude": complaint.latitude,
            "longitude": complaint.longitude
        }

        # Validate coordinates
        if (complaint.latitude is None) != (complaint.longitude is None):
            raise HTTPException(
                status_code=400,
                detail="Latitude and longitude must be provided together."
            )

        if complaint.latitude is not None:
            if not -90 <= complaint.latitude <= 90:
                raise HTTPException(status_code=400, detail="Invalid latitude.")

            if not -180 <= complaint.longitude <= 180:
                raise HTTPException(status_code=400, detail="Invalid longitude.")

        # Save complaint to Supabase
        result = (
            supabase.table("complaints")
            .insert(complaint_data)
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=500,
                detail="Complaint could not be saved."
            )

        saved_complaint = result.data[0]

        # Run ML intelligence if coordinates are available
        ml_result = None

        if complaint.latitude is not None:
            try:
                ml_result = intelligence.analyze_complaint(
                    latitude=complaint.latitude,
                    longitude=complaint.longitude,
                    radius_metres=100,
                    complaint_text=complaint.description
                )

                # Clean NaN values before returning JSON
                def clean_nan(data):
                    import math
                    import numpy as np

                    if isinstance(data, dict):
                        return {
                            key: clean_nan(value)
                            for key, value in data.items()
                        }

                    if isinstance(data, (list, tuple)):
                        return [clean_nan(item) for item in data]

                    if isinstance(data, (float, np.floating)):
                        return float(data) if math.isfinite(float(data)) else None

                    if isinstance(data, np.integer):
                        return int(data)

                    return data

                ml_result = clean_nan(ml_result)

            except Exception as ml_error:
                ml_result = {
                    "error": str(ml_error)
                }

        return {
            "status": "success",
            "message": "Complaint submitted successfully!",
            "complaint": saved_complaint,
            "intelligence": ml_result
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/api/complaints")
def get_complaints():
    try:
        result = (
            supabase.table("complaints")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data),
            "complaints": result.data
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
@app.get("/api/complaints/{complaint_id}")
def get_complaint(complaint_id: str):
    try:
        result = (
            supabase.table("complaints")
            .select("*")
            .eq("id", complaint_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Complaint not found"
            )

        return {
            "status": "success",
            "complaint": result.data[0]
        }

    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )



@app.patch("/api/complaints/{complaint_id}/status")
def update_complaint_status(
    complaint_id: str,
    update: ComplaintStatusUpdate
):
    try:
        # Get existing complaint
        existing = (
            supabase.table("complaints")
            .select("*")
            .eq("id", complaint_id)
            .execute()
        )

        if not existing.data:
            raise HTTPException(
                status_code=404,
                detail="Complaint not found"
            )

        old_status = existing.data[0]["status"]

        # Update complaint
        result = (
            supabase.table("complaints")
            .update({"status": update.status})
            .eq("id", complaint_id)
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=404,
                detail="Complaint not found"
            )

        # Insert timeline event using actual column names
        timeline_entry = {
            "complaint_id": complaint_id,
            "title": "Complaint status updated",
            "status": update.status,
            "actor": "Municipal Officer",
            "description": f"Status changed from {old_status} to {update.status}"
        }

        timeline_result = (
            supabase.table("complaint_timeline")
            .insert(timeline_entry)
            .execute()
        )

        return {
            "status": "success",
            "message": "Complaint updated and timeline recorded!",
            "complaint": result.data[0],
            "timeline": timeline_result.data
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )
@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    try:
        complaints_result = (
            supabase.table("complaints")
            .select("id,status")
            .execute()
        )

        assets_result = (
            supabase.table("assets")
            .select("id")
            .execute()
        )

        complaints = complaints_result.data
        assets = assets_result.data

        stats = {
            "total_complaints": len(complaints),
            "pending_complaints": sum(
                1 for c in complaints
                if c["status"] == "pending"
            ),
            "under_review_complaints": sum(
                1 for c in complaints
                if c["status"] == "under_review"
            ),
            "assigned_complaints": sum(
                1 for c in complaints
                if c["status"] == "assigned"
            ),
            "in_progress_complaints": sum(
                1 for c in complaints
                if c["status"] == "in_progress"
            ),
            "resolved_complaints": sum(
                1 for c in complaints
                if c["status"] == "resolved"
            ),
            "rejected_complaints": sum(
                1 for c in complaints
                if c["status"] == "rejected"
            ),
            "total_assets": len(assets)
        }

        return {
            "status": "success",
            "stats": stats
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )    

@app.get("/api/dashboard/priority")
def get_priority_analytics():
    try:
        result = (
            supabase.table("complaint_priority_summary")
            .select("*")
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data),
            "priority_analytics": result.data
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get("/api/dashboard/recurrence")
def get_asset_recurrence():
    try:
        result = (
            supabase.table("asset_recurrence_summary")
            .select("*")
            .order("total_historical_issues", desc=True)
            .execute()
        )

        return {
            "status": "success",
            "count": len(result.data),
            "asset_recurrence": result.data
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@app.get("/api/complaints/{complaint_id}/timeline")
def get_complaint_timeline(complaint_id: str):
    try:
        result = (
            supabase.table("complaint_timeline")
            .select("*")
            .eq("complaint_id", complaint_id)
            .order("created_at", desc=False)
            .execute()
        )

        return {
            "status": "success",
            "timeline": result.data
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


@app.get("/api/officer/complaints")
def get_officer_complaints(ward: str = None, status: str = None):
    try:
        query = supabase.table("complaints").select("*")

        # Temporarily show all complaints because ward values are null
        if status:
            query = query.eq(
                "status",
                status.lower().replace(" ", "_")
            )

        result = query.order("created_at", desc=True).execute()

        return {
            "status": "success",
            "count": len(result.data),
            "complaints": result.data
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))
    
@app.get("/api/complaints/{complaint_id}/timeline")
def get_complaint_timeline(complaint_id: str):
    try:
        response = (
            supabase.table("complaint_timeline")
            .select("*")
            .eq("complaint_id", complaint_id)
            .order("created_at", desc=False)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/officer/complaints")
def get_officer_complaints(
    ward: str = None,
    status: str = None
):
    try:
        query = supabase.table("complaints").select("*")

        if ward:
            query = query.eq("ward", ward)

        if status:
            query = query.eq("status", status)

        response = query.order("created_at", desc=True).execute()
        return response.data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/intelligence/analyze")
def analyze_complaint_intelligence(request: IntelligenceAnalysisRequest):
    try:
        result = intelligence.analyze_complaint(
            latitude=request.latitude,
            longitude=request.longitude,
            radius_metres=request.radius_metres,
            complaint_text=request.complaint_text
        )

        def clean_nan(data):
            if isinstance(data, dict):
                return {
                    key: clean_nan(value)
                    for key, value in data.items()
                }

            if isinstance(data, (list, tuple)):
                return [clean_nan(item) for item in data]

            if isinstance(data, (float, np.floating)):
                return float(data) if math.isfinite(float(data)) else None

            if isinstance(data, np.integer):
                return int(data)

            return data

        return {
            "status": "success",
            "intelligence": clean_nan(result)
        }

    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error))

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

@app.get("/api/intelligence/graph-summary")
def get_intelligence_graph_summary():
    try:
        return {
            "status": "success",
            "graph": intelligence.get_graph_summary()
        }

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))