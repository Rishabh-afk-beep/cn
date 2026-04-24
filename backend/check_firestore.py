"""Quick script to verify Firestore connection and list stored users."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.core.firebase import initialize_firebase
initialize_firebase()

from app.repositories.firestore_client import get_firestore_client

client = get_firestore_client()
if client is None:
    print("[FAIL] Firestore client is NONE -- using in-memory fallback")
    print("   Check FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS in .env")
else:
    print(f"[OK] Firestore connected to project: {client.project}")
    print("\nUsers in Firestore:")
    users = list(client.collection("users").stream())
    if not users:
        print("   (no users yet)")
    for doc in users:
        d = doc.to_dict()
        print(f"   - {doc.id}: role={d.get('role','?')} | name={d.get('name','?')} | email={d.get('email','?')} | status={d.get('status','?')}")
    print(f"\n   Total: {len(users)} user(s)")
