import requests, json, os
import time

def test_endpoint(method, url, headers=None, data=None, expected_status=200):
    if method.lower() == "get":
        resp = requests.get(url, headers=headers)
    elif method.lower() == "post":
        resp = requests.post(url, json=data, headers=headers)
    elif method.lower() == "put":
        resp = requests.put(url, json=data, headers=headers)
    elif method.lower() == "delete":
        resp = requests.delete(url, headers=headers)
    
    print(f"Testing {method} {url}")
    print(f"Status: {resp.status_code} (Expected: {expected_status})")
    print(f"Success: {resp.status_code == expected_status}")
    
    try:
        print(json.dumps(resp.json(), indent=2))
    except:
        print(resp.text)
    
    print("-" * 60)
    return resp

# Setup
base_url = "http://localhost:5002/api/v1"
token = open("token.txt", "r").read().strip()
headers = {"Authorization": f"Bearer {token}"}
set_id = open("flashcardset_id.txt", "r").read().strip()

# Test endpoints one by one
print("TESTING GET ENDPOINTS:")
test_endpoint("GET", f"{base_url}/auth/me", headers)
test_endpoint("GET", f"{base_url}/flashcard-sets", headers)
test_endpoint("GET", f"{base_url}/flashcard-sets/{set_id}", headers)
test_endpoint("GET", f"{base_url}/flashcard-sets/{set_id}/stats", headers)
test_endpoint("GET", f"{base_url}/flashcard-sets/public")

print("TESTING UPDATE ENDPOINT:")
update_data = {
    "title": "Updated Flashcard Set",
    "description": "This set was updated by API testing"
}
test_endpoint("PUT", f"{base_url}/flashcard-sets/{set_id}", headers, update_data)

print("TESTING PROCESSOR ENDPOINTS:")
print("Text Processing:")
text_data = {
    "content": "The mitochondria is the powerhouse of the cell. Photosynthesis is the process by which plants convert sunlight into energy.",
    "language": "english",
    "title": "Biology Concepts"
}
process_resp = test_endpoint("POST", f"{base_url}/processor/text", headers, text_data, 202)
if process_resp.status_code == 202 and "taskId" in process_resp.json():
    task_id = process_resp.json()["taskId"]
    print(f"Task ID: {task_id}")
    test_endpoint("GET", f"{base_url}/processor/task/{task_id}", headers)
    
    # Wait a moment and check again to see progress
    print("Waiting 2 seconds to check task progress...")
    time.sleep(2)
    test_endpoint("GET", f"{base_url}/processor/task/{task_id}", headers)

print("URL Processing:")
url_data = {
    "url": "https://en.wikipedia.org/wiki/Flashcard",
    "language": "english"
}
url_resp = test_endpoint("POST", f"{base_url}/processor/url", headers, url_data, 202)
if url_resp.status_code == 202 and "taskId" in url_resp.json():
    task_id = url_resp.json()["taskId"]
    print(f"Task ID: {task_id}")
    test_endpoint("GET", f"{base_url}/processor/task/{task_id}", headers)

print("TESTING FLASHCARD DUPLICATION:")
duplicate_data = {
    "title": "Duplicated Flashcard Set"
}
duplicate_resp = test_endpoint("POST", f"{base_url}/flashcard-sets/{set_id}/duplicate", headers, duplicate_data, 201)

print("TESTING DELETE ENDPOINT:")
# Create a temporary flashcard set to delete
temp_set_data = {
    "title": "Temporary Set for Deletion Test",
    "description": "This set will be deleted",
    "flashcards": [
        {
            "front": "Delete me",
            "back": "Testing deletion",
            "difficulty": "easy"
        }
    ],
    "isPublic": False
}
temp_set_resp = test_endpoint("POST", f"{base_url}/flashcard-sets", headers, temp_set_data, 201)

if temp_set_resp.status_code == 201 and "flashcardSet" in temp_set_resp.json():
    temp_set_id = temp_set_resp.json()["flashcardSet"]["id"]
    print(f"Created temporary set with ID: {temp_set_id}")
    
    # Now delete it
    test_endpoint("DELETE", f"{base_url}/flashcard-sets/{temp_set_id}", headers, expected_status=200)
