from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from .recommender import compute_scores

app = FastAPI(title="SmartReco ML Service")


class UserProfile(BaseModel):
    id: str
    branch: Optional[str] = None
    year: Optional[int] = None
    interests: List[str] = []


class Resource(BaseModel):
    id: str
    title: str
    type: Optional[str] = None
    tags: List[str] = []
    difficulty: Optional[str] = None
    rating: Optional[float] = None
    createdAt: Optional[str] = None


class Interaction(BaseModel):
    resourceId: str
    action: str


class RecommendRequest(BaseModel):
    user: UserProfile
    resources: List[Resource]
    interactions: List[Interaction] = []


class RecommendResponse(BaseModel):
    recommended_ids: List[str]


@app.get("/health")
def health():
    return {"status": "ok", "service": "ml-service"}


@app.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    payload = {
        "user": req.user.model_dump(),
        "resources": [r.model_dump() for r in req.resources],
        "interactions": [i.model_dump() for i in req.interactions],
    }

    ids = compute_scores(payload)
    return RecommendResponse(recommended_ids=ids)
