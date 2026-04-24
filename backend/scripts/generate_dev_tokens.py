import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt

BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from app.core.config import get_settings


def main() -> None:
    settings = get_settings()
    users_path = BASE_DIR / "data" / "dev_users.json"
    users = json.loads(users_path.read_text(encoding="utf-8"))

    now = datetime.now(timezone.utc)
    exp = now + timedelta(hours=12)

    print("DEV_TOKENS")
    print("==========")
    for user in users:
        payload = {
            "uid": user["uid"],
            "role": user["role"],
            "name": user.get("name"),
            "email": user.get("email"),
            "iat": int(now.timestamp()),
            "exp": int(exp.timestamp()),
        }
        token = jwt.encode(payload, settings.dev_auth_secret, algorithm="HS256")
        print(f"{user['role'].upper()}={token}")


if __name__ == "__main__":
    main()
