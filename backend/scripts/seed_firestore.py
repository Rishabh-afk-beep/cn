"""
Seed Firestore with sample data for development.
Run: python scripts/seed_firestore.py
"""
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from google.oauth2 import service_account
from google.cloud import firestore

PROJECT_ID = "urbanpg-a7198"
CREDS_PATH = os.path.join(os.path.dirname(__file__), "..", "firebase-service-account.json")

credentials = service_account.Credentials.from_service_account_file(CREDS_PATH)
db = firestore.Client(project=PROJECT_ID, credentials=credentials)


def seed_colleges():
    colleges = [
        {
            "college_id": "sample-college-1",
            "name": "Sample Engineering College",
            "short_name": "SEC",
            "address": "Tech Park Road",
            "city": "Hyderabad",
            "state": "Telangana",
            "latitude": 17.3850,
            "longitude": 78.4867,
            "status": "active",
        },
        {
            "college_id": "sample-college-2",
            "name": "Warangal Institute of Technology",
            "short_name": "WIT",
            "address": "Kazipet Highway",
            "city": "Warangal",
            "state": "Telangana",
            "latitude": 17.9784,
            "longitude": 79.5302,
            "status": "active",
        },
    ]
    for c in colleges:
        db.collection("colleges").document(c["college_id"]).set(c)
        print(f"  [OK] College: {c['name']}")


def seed_properties():
    properties = [
        {
            "property_id": "p1",
            "title": "Green Nest PG",
            "property_type": "pg",
            "gender": "male",
            "address_text": "Plot 45, Gachibowli Road, Hyderabad",
            "latitude": 17.3861,
            "longitude": 78.4898,
            "rent_min": 6500,
            "rent_max": 8500,
            "deposit_amount": 15000,
            "description": "Well-furnished PG with AC rooms, attached bathrooms, WiFi, 24/7 power backup. Meals included.",
            "amenities": ["wifi", "ac", "laundry", "meals", "power-backup"],
            "images": [
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            ],
            "cover_image": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
            "distance_km": 0.85,
            "nearest_college_id": "sample-college-1",
            "owner_uid": "owner-1",
            "owner_name": "Mr. Sharma",
            "owner_phone": "+91 9876543210",
            "status": "live",
            "is_featured": True,
            "avg_rating": 4.2,
            "review_count": 12,
            "food_available": True,
            "food_type": "veg_nonveg",
            "room_options": [
                {"occupancy": "single", "rent": 8500, "available": True},
                {"occupancy": "double", "rent": 6500, "available": True},
                {"occupancy": "triple", "rent": 5000, "available": False},
            ],
        },
        {
            "property_id": "p2",
            "title": "Sunshine Hostel for Women",
            "property_type": "hostel",
            "gender": "female",
            "address_text": "Street 7, Near SEC Back Gate",
            "latitude": 17.3840,
            "longitude": 78.4855,
            "rent_min": 5000,
            "rent_max": 7500,
            "deposit_amount": 10000,
            "description": "Safe and comfortable hostel for female students. CCTV, warden, and mess facilities.",
            "amenities": ["wifi", "cctv", "meals", "laundry", "study-room"],
            "images": [
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
                "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            ],
            "cover_image": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
            "distance_km": 0.45,
            "nearest_college_id": "sample-college-1",
            "owner_uid": "owner-2",
            "owner_name": "Mrs. Reddy",
            "owner_phone": "+91 8765432109",
            "status": "live",
            "is_featured": True,
            "avg_rating": 4.5,
            "review_count": 8,
            "food_available": True,
            "food_type": "veg",
            "room_options": [
                {"occupancy": "double", "rent": 6000, "available": True},
                {"occupancy": "triple", "rent": 5000, "available": True},
            ],
        },
        {
            "property_id": "p3",
            "title": "Campus View Rooms",
            "property_type": "single_room",
            "gender": "any",
            "address_text": "Building 12, Campus Road, Near SEC Gate",
            "latitude": 17.3870,
            "longitude": 78.4910,
            "rent_min": 9000,
            "rent_max": 12000,
            "deposit_amount": 20000,
            "description": "Premium single rooms with campus view. Fully furnished, private bathroom, balcony access.",
            "amenities": ["wifi", "ac", "attached-bathroom", "balcony", "parking"],
            "images": [
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
            ],
            "cover_image": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            "distance_km": 0.90,
            "nearest_college_id": "sample-college-1",
            "owner_uid": "owner-3",
            "owner_name": "Mr. Patel",
            "owner_phone": "+91 7654321098",
            "status": "live",
            "is_featured": False,
            "avg_rating": 4.0,
            "review_count": 4,
            "food_available": False,
            "room_options": [
                {"occupancy": "single", "rent": 12000, "available": True},
            ],
        },
    ]
    for p in properties:
        db.collection("properties").document(p["property_id"]).set(p)
        print(f"  [OK] Property: {p['title']}")


if __name__ == "__main__":
    print("Seeding Firestore...")
    print("\nColleges:")
    seed_colleges()
    print("\nProperties:")
    seed_properties()
    print("\nDone! Firestore seeded successfully.")
