from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np
from datetime import datetime


def build_resource_corpus(resources: List[Dict]) -> List[str]:
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
    interests = " ".join(user.get("interests") or [])
    branch = user.get("branch") or ""
    year = user.get("year")
    year_text = f"year{year}" if year else ""
    return f"{interests} {branch} {year_text}"


def compute_scores(payload: Dict) -> List[str]:
    user = payload["user"]
    resources = payload["resources"]
    interactions = payload.get("interactions", [])

    if not resources:
        return []

    corpus = build_resource_corpus(resources)

    vectorizer = TfidfVectorizer(stop_words="english")
    resource_matrix = vectorizer.fit_transform(corpus)

    id_to_index = {r["id"]: idx for idx, r in enumerate(resources)}

    interaction_weights = {"view": 1.0, "like": 4.0, "save": 5.0}
    user_vec = None
    total_weight = 0.0

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

    if user_vec is not None and total_weight > 0:
        user_vec = user_vec / total_weight
    else:
        profile_text = build_user_profile_text(user)
        if profile_text.strip():
            user_vec = vectorizer.transform([profile_text])
        else:
            user_vec = resource_matrix.mean(axis=0)

    cosine_sim = linear_kernel(user_vec, resource_matrix).flatten()
    scores = np.array(cosine_sim, dtype=float)

    now = datetime.utcnow()
    for i, r in enumerate(resources):
        rating = r.get("rating")
        if isinstance(rating, (int, float)):
            scores[i] += float(rating)

        created_at = r.get("createdAt")
        if created_at:
            try:
                dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                days_old = (now - dt).days
                if days_old < 7:
                    scores[i] += 1.0
                elif days_old < 30:
                    scores[i] += 0.5
            except Exception:
                pass

    sorted_idx = np.argsort(scores)[::-1]
    recommended_ids = [resources[idx]["id"] for idx in sorted_idx]

    return recommended_ids
