from typing import Dict, Any, List
from pydantic import BaseModel


class AdminStatsResponse(BaseModel):
    total_users: int
    total_crops: int
    total_pests_diseases: int
    total_products: int
    total_bookmarks: int
    total_learning_records: int
    recent_users: List[Dict[str, Any]] = []
