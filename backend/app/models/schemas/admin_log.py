from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class AdminLogOut(BaseModel):
    log_id: str
    admin_uid: str
    action_type: str
    target_type: str
    target_id: str
    reason: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: str
