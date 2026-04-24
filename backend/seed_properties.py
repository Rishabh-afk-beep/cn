"""Seed sample properties into Firestore so the Discover page has real data."""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.core.firebase import initialize_firebase
initialize_firebase()

from app.repositories.firestore_client import get_firestore_client

client = get_firestore_client()
if not client:
    print("[FAIL] No Firestore client. Check .env")
    sys.exit(1)

print(f"[OK] Connected to Firestore: {client.project}")

# Sample properties to seed
PROPERTIES = [
    {
        "property_id": "p1",
        "owner_uid": "owner_demo",
        "title": "Green Nest PG",
        "property_type": "pg",
        "primary_college_id": "sample-college-1",
        "description": "A comfortable PG with homely food and all modern amenities. Walking distance from campus. Fully furnished rooms with daily housekeeping.",
        "address_text": "Plot 45, Gachibowli Road, Hyderabad",
        "rent_min": 6500,
        "rent_max": 8500,
        "security_deposit": 5000,
        "amenities": ["wifi", "food", "laundry", "cctv", "geyser"],
        "rating_avg": 4.2,
        "rating_count": 38,
        "review_count": 38,
        "availability_status": "available",
        "approval_status": "approved",
        "visibility_status": "live",
        "featured": False,
        "gender": "male",
        "food_available": True,
        "food_menu": "Breakfast & Dinner included. Veg/Non-Veg options.",
        "rules": "No smoking inside rooms. Gate closes at 10 PM.",
        "cover_image_url": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
        "image_urls": [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
        ],
        "latitude": 17.392,
        "longitude": 78.49,
        "room_options": [
            {"option_id": "r1", "label": "Single", "price": 8500, "available_count": 3, "status": "available"},
            {"option_id": "r2", "label": "2-Sharing", "price": 6500, "available_count": 5, "status": "available"},
            {"option_id": "r3", "label": "3-Sharing", "price": 5500, "available_count": 4, "status": "available"},
        ],
        "created_at": "2026-03-01T10:00:00+00:00",
        "updated_at": "2026-04-10T12:00:00+00:00",
    },
    {
        "property_id": "p2",
        "owner_uid": "owner_demo",
        "title": "Campus View Rooms",
        "property_type": "single_room",
        "primary_college_id": "sample-college-1",
        "description": "Fully furnished single rooms with attached bathroom. 24/7 water and power backup. Walking distance to campus.",
        "address_text": "Building 12, Campus Road, Near SEC Gate",
        "rent_min": 9000,
        "rent_max": 12000,
        "security_deposit": 10000,
        "amenities": ["wifi", "ac", "parking", "cctv", "power_backup"],
        "rating_avg": 4.0,
        "rating_count": 14,
        "review_count": 14,
        "availability_status": "available",
        "approval_status": "approved",
        "visibility_status": "live",
        "featured": False,
        "gender": "any",
        "food_available": False,
        "cover_image_url": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
        "image_urls": [
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        ],
        "latitude": 17.379,
        "longitude": 78.481,
        "created_at": "2026-03-15T08:00:00+00:00",
        "updated_at": "2026-04-11T09:00:00+00:00",
    },
    {
        "property_id": "p3",
        "owner_uid": "owner_demo",
        "title": "Sunshine Hostel for Women",
        "property_type": "hostel",
        "primary_college_id": "sample-college-1",
        "description": "Safe women-only hostel with 24/7 security, mess, study rooms, and gym. Located near back gate.",
        "address_text": "Street 7, Near SEC Back Gate",
        "rent_min": 5000,
        "rent_max": 7500,
        "security_deposit": 3000,
        "amenities": ["wifi", "food", "cctv", "geyser", "gym", "study_room"],
        "rating_avg": 4.5,
        "rating_count": 22,
        "review_count": 22,
        "availability_status": "available",
        "approval_status": "approved",
        "visibility_status": "live",
        "featured": True,
        "gender": "female",
        "food_available": True,
        "food_menu": "3 meals/day included. Pure Veg.",
        "rules": "Only women allowed. Curfew at 9 PM.",
        "cover_image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        "image_urls": [
            "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        ],
        "latitude": 17.388,
        "longitude": 78.483,
        "room_options": [
            {"option_id": "r1", "label": "4-Sharing", "price": 5000, "available_count": 8, "status": "available"},
            {"option_id": "r2", "label": "2-Sharing", "price": 7500, "available_count": 4, "status": "available"},
        ],
        "created_at": "2026-02-20T06:00:00+00:00",
        "updated_at": "2026-04-12T14:00:00+00:00",
    },
    {
        "property_id": "p4",
        "owner_uid": "owner_demo",
        "title": "BlueSky Co-Living Space",
        "property_type": "co_living",
        "primary_college_id": "sample-college-1",
        "description": "Modern co-living space with coworking area, community kitchen, events, and high-speed internet. Perfect for students who want community.",
        "address_text": "Tower B, Tech Park Avenue, Gachibowli",
        "rent_min": 10000,
        "rent_max": 15000,
        "security_deposit": 12000,
        "amenities": ["wifi", "ac", "coworking", "gym", "laundry", "events"],
        "rating_avg": 4.7,
        "rating_count": 9,
        "review_count": 9,
        "availability_status": "available",
        "approval_status": "approved",
        "visibility_status": "live",
        "featured": True,
        "gender": "any",
        "food_available": False,
        "cover_image_url": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        "image_urls": [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
        ],
        "latitude": 17.3850,
        "longitude": 78.4867,
        "created_at": "2026-03-20T10:00:00+00:00",
        "updated_at": "2026-04-15T12:00:00+00:00",
    },
    {
        "property_id": "p5",
        "owner_uid": "owner_demo",
        "title": "Cozy 2BHK Flat Near Campus",
        "property_type": "flat",
        "primary_college_id": "sample-college-1",
        "description": "Spacious 2BHK flat with balcony, fully furnished, lift access, and 24/7 water supply. Ideal for 2-3 students sharing.",
        "address_text": "Flat 301, Maple Heights, Kukatpally",
        "rent_min": 14000,
        "rent_max": 16000,
        "security_deposit": 20000,
        "amenities": ["wifi", "ac", "parking", "lift", "power_backup"],
        "rating_avg": 3.8,
        "rating_count": 6,
        "review_count": 6,
        "availability_status": "available",
        "approval_status": "approved",
        "visibility_status": "live",
        "featured": False,
        "gender": "any",
        "food_available": False,
        "cover_image_url": "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80",
        "image_urls": [
            "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80",
        ],
        "latitude": 17.395,
        "longitude": 78.475,
        "metadata": {
            "bhk_type": "2BHK",
            "furnishing": "fully_furnished",
            "floor": 3,
            "lift": True,
            "society_name": "Maple Heights",
        },
        "created_at": "2026-04-01T08:00:00+00:00",
        "updated_at": "2026-04-18T09:00:00+00:00",
    },
]

# Seed to Firestore
batch = client.batch()
for prop in PROPERTIES:
    ref = client.collection("properties").document(prop["property_id"])
    batch.set(ref, prop, merge=True)

batch.commit()
print(f"\n[OK] Seeded {len(PROPERTIES)} properties to Firestore 'properties' collection:")
for p in PROPERTIES:
    print(f"   - {p['property_id']}: {p['title']} ({p['property_type']}) - {p['approval_status']}/{p['visibility_status']}")

# Verify
count = len(list(client.collection("properties").stream()))
print(f"\n[OK] Total properties in Firestore: {count}")
