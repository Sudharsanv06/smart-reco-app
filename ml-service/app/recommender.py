"""
SmartReco ML Recommendation Engine

This module implements content-based filtering using TF-IDF vectorization
and cosine similarity to generate personalized learning resource recommendations.

Algorithm:
1. Build text corpus from resource metadata (title, tags, type, difficulty)
2. Apply TF-IDF vectorization to create feature vectors
3. Build user profile vector from interaction history (weighted by action type)
4. Compute cosine similarity between user vector and all resource vectors
5. Apply boosting: rating boost + recency boost
6. Return ranked list of resource IDs
"""

from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np
from datetime import datetime


def build_resource_corpus(resources: List[Dict]) -> List[str]:
    """
    Build text corpus from resource metadata for TF-IDF vectorization.
    
    Combines title, tags, type, and difficulty into a single text string
    per resource to capture content characteristics.
    
    Args:
        resources (List[Dict]): List of resource objects with metadata
        
    Returns:
        List[str]: Text corpus where each string represents one resource
        
    Example:
        >>> resources = [{"title": "Python Tutorial", "tags": ["python", "beginner"], 
        ...               "type": "video", "difficulty": "beginner"}]
        >>> build_resource_corpus(resources)
        ["Python Tutorial python beginner video beginner"]
    """
    corpus = []
    for r in resources:
        tags_text = " ".join(r.get("tags") or [])
        title = r.get("title") or ""
        r_type = r.get("type") or ""
        difficulty = r.get("difficulty") or ""
        text = f"{title} {tags_text} {r_type} {difficulty}"
        corpus.append(text)
    return corpus


def build_user_profile_text(user: Dict) -> str:
    """
    Build user profile text from user metadata.
    
    Used as fallback when user has no interaction history.
    Combines interests, branch, and academic year.
    
    Args:
        user (Dict): User object with profile data
        
    Returns:
        str: Text representation of user profile
        
    Example:
        >>> user = {"interests": ["ML", "Python"], "branch": "AIML", "year": 3}
        >>> build_user_profile_text(user)
        "ML Python AIML year3"
    """
    interests = " ".join(user.get("interests") or [])
    branch = user.get("branch") or ""
    year = user.get("year")
    year_text = f"year{year}" if year else ""
    return f"{interests} {branch} {year_text}"


def compute_scores(payload: Dict) -> List[str]:
    """
    Compute personalized recommendation scores using content-based filtering.
    
    Main recommendation algorithm that:
    1. Vectorizes resources using TF-IDF
    2. Builds user profile from interaction history (weighted average)
    3. Computes cosine similarity
    4. Applies rating and recency boosts
    5. Returns sorted resource IDs by score
    
    Interaction Weights:
        - view: 1.0 (mild interest)
        - like: 4.0 (strong interest)
        - save: 5.0 (highest interest)
    
    Recency Boost:
        - Resources < 7 days old: +1.0
        - Resources < 30 days old: +0.5
    
    Args:
        payload (Dict): Contains:
            - user (Dict): User profile data
            - resources (List[Dict]): All available resources
            - interactions (List[Dict]): User's interaction history
            
    Returns:
        List[str]: Ordered list of resource IDs (highest to lowest score)
        
    Example:
        >>> payload = {
        ...     "user": {"id": "123", "interests": ["ML"]},
        ...     "resources": [...],
        ...     "interactions": [{"resourceId": "abc", "action": "save"}]
        ... }
        >>> compute_scores(payload)
        ["resource_id_1", "resource_id_2", ...]
    """
    user = payload["user"]
    resources = payload["resources"]
    interactions = payload.get("interactions", [])

    if not resources:
        return []

    # Step 1: Build corpus and vectorize resources using TF-IDF
    corpus = build_resource_corpus(resources)
    vectorizer = TfidfVectorizer(stop_words="english")
    resource_matrix = vectorizer.fit_transform(corpus)

    id_to_index = {r["id"]: idx for idx, r in enumerate(resources)}

    # Step 2: Build user profile vector from interactions
    interaction_weights = {"view": 1.0, "like": 4.0, "save": 5.0}
    user_vec = None
    total_weight = 0.0

    # Weighted average of interacted resource vectors
    for inter in interactions:
        r_id = inter["resourceId"]
        action = inter["action"]
        if r_id not in id_to_index:
            continue
        idx = id_to_index[r_id]
        weight = interaction_weights.get(action, 0.0)
        if weight <= 0:
            continue

        r_vec = resource_matrix[idx]
        if user_vec is None:
            user_vec = weight * r_vec
        else:
            user_vec = user_vec + weight * r_vec
        total_weight += weight

    # Normalize or use fallback profile
    if user_vec is not None and total_weight > 0:
        user_vec = user_vec / total_weight
    else:
        # Fallback: use user profile text or mean of all resources
        profile_text = build_user_profile_text(user)
        if profile_text.strip():
            user_vec = vectorizer.transform([profile_text])
        else:
            user_vec = resource_matrix.mean(axis=0)

    # Step 3: Compute cosine similarity between user vector and all resources
    cosine_sim = linear_kernel(user_vec, resource_matrix).flatten()
    scores = np.array(cosine_sim, dtype=float)

    # Step 4: Apply boosting factors
    now = datetime.utcnow()
    for i, r in enumerate(resources):
        # Rating boost: add numeric rating (0-5)
        rating = r.get("rating")
        if isinstance(rating, (int, float)):
            scores[i] += float(rating)

        # Recency boost: prioritize newer content
        created_at = r.get("createdAt")
        if created_at:
            try:
                dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                days_old = (now - dt).days
                if days_old < 7:
                    scores[i] += 1.0  # Fresh content
                elif days_old < 30:
                    scores[i] += 0.5  # Recent content
            except Exception:
                pass

    # Step 5: Sort by score (descending) and return resource IDs
    sorted_idx = np.argsort(scores)[::-1]
    recommended_ids = [resources[idx]["id"] for idx in sorted_idx]

    return recommended_ids
