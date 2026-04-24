from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import uuid4

from app.models.schemas.admin_log import AdminLogOut
from app.repositories.firestore_client import get_firestore_client

_FALLBACK_ADMIN_LOGS: List[AdminLogOut] = []


class AdminLogRepository:
    @staticmethod
    def _now() -> str:
        return datetime.now(timezone.utc).isoformat()

    def create(
        self,
        admin_uid: str,
        action_type: str,
        target_type: str,
        target_id: str,
        reason: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AdminLogOut:
        log = AdminLogOut(
            log_id=f"log_{uuid4().hex[:10]}",
            admin_uid=admin_uid,
            action_type=action_type,
            target_type=target_type,
            target_id=target_id,
            reason=reason,
            metadata=metadata or {},
            created_at=self._now(),
        )

        client = get_firestore_client()
        if client is None:
            _FALLBACK_ADMIN_LOGS.append(log)
            return log

        client.collection("admin_logs").document(log.log_id).set(log.model_dump())
        return log

    def list_logs(self, limit: int = 100) -> List[AdminLogOut]:
        client = get_firestore_client()
        if client is None:
            return list(reversed(_FALLBACK_ADMIN_LOGS[-limit:]))

        docs = client.collection("admin_logs").stream()
        items = [AdminLogOut(**doc.to_dict()) for doc in docs]
        items.sort(key=lambda x: x.created_at, reverse=True)
        return items[:limit]
