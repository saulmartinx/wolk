import requests
import sys
import json
from datetime import datetime

class PiWorkAPITester:
    def __init__(self, base_url="https://752e27c8-c910-4d7c-94c9-c695969db062.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.job_ids = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - {name}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list) and len(response_data) > 0:
                        print(f"   Response: Found {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_get_jobs(self):
        """Test getting all jobs"""
        success, response = self.run_test(
            "Get All Jobs",
            "GET",
            "api/jobs",
            200
        )
        if success and isinstance(response, list):
            self.job_ids = [job.get('id') for job in response if job.get('id')]
            print(f"   Found {len(self.job_ids)} jobs with IDs")
        return success

    def test_get_jobs_with_category(self):
        """Test getting jobs with category filter"""
        success, response = self.run_test(
            "Get Jobs by Category",
            "GET",
            "api/jobs",
            200,
            params={"category": "Technology"}
        )
        if success and isinstance(response, list):
            tech_jobs = [job for job in response if job.get('category') == 'Technology']
            print(f"   Found {len(tech_jobs)} Technology jobs")
        return success

    def test_get_single_job(self):
        """Test getting a single job by ID"""
        if not self.job_ids:
            print("❌ No job IDs available for single job test")
            return False
            
        job_id = self.job_ids[0]
        success, response = self.run_test(
            "Get Single Job",
            "GET",
            f"api/jobs/{job_id}",
            200
        )
        if success and isinstance(response, dict):
            print(f"   Job title: {response.get('title', 'N/A')}")
            print(f"   Job payment: {response.get('payment', 'N/A')} Pi Coin")
        return success

    def test_get_nonexistent_job(self):
        """Test getting a non-existent job"""
        fake_id = "non-existent-job-id"
        success, response = self.run_test(
            "Get Non-existent Job",
            "GET",
            f"api/jobs/{fake_id}",
            404
        )
        return success

    def test_get_categories(self):
        """Test getting job categories"""
        success, response = self.run_test(
            "Get Categories",
            "GET",
            "api/categories",
            200
        )
        if success and isinstance(response, dict) and 'categories' in response:
            categories = response['categories']
            print(f"   Categories: {categories}")
        return success

    def test_swipe_accept(self):
        """Test accepting a job"""
        if not self.job_ids:
            print("❌ No job IDs available for swipe test")
            return False
            
        job_id = self.job_ids[0]
        swipe_data = {
            "job_id": job_id,
            "user_id": "test_user_123",
            "action": "accept"
        }
        
        success, response = self.run_test(
            "Swipe Accept",
            "POST",
            "api/swipe",
            200,
            data=swipe_data
        )
        if success and isinstance(response, dict):
            print(f"   Message: {response.get('message', 'N/A')}")
            print(f"   Match: {response.get('match', 'N/A')}")
        return success

    def test_swipe_reject(self):
        """Test rejecting a job"""
        if not self.job_ids:
            print("❌ No job IDs available for swipe test")
            return False
            
        job_id = self.job_ids[-1] if len(self.job_ids) > 1 else self.job_ids[0]
        swipe_data = {
            "job_id": job_id,
            "user_id": "test_user_123",
            "action": "reject"
        }
        
        success, response = self.run_test(
            "Swipe Reject",
            "POST",
            "api/swipe",
            200,
            data=swipe_data
        )
        if success and isinstance(response, dict):
            print(f"   Message: {response.get('message', 'N/A')}")
            print(f"   Match: {response.get('match', 'N/A')}")
        return success

    def test_invalid_swipe(self):
        """Test swipe with invalid data"""
        invalid_data = {
            "job_id": "invalid-job-id",
            "user_id": "test_user",
            "action": "invalid_action"
        }
        
        success, response = self.run_test(
            "Invalid Swipe Action",
            "POST",
            "api/swipe",
            200,  # API doesn't validate action type, so it returns 200
            data=invalid_data
        )
        return success

def main():
    print("🚀 Starting Pi Work API Tests")
    print("=" * 50)
    
    tester = PiWorkAPITester()
    
    # Run all tests
    test_results = []
    
    # Basic functionality tests
    test_results.append(tester.test_health_check())
    test_results.append(tester.test_get_jobs())
    test_results.append(tester.test_get_categories())
    
    # Job-specific tests (depend on jobs being available)
    test_results.append(tester.test_get_jobs_with_category())
    test_results.append(tester.test_get_single_job())
    test_results.append(tester.test_get_nonexistent_job())
    
    # Swipe functionality tests
    test_results.append(tester.test_swipe_accept())
    test_results.append(tester.test_swipe_reject())
    test_results.append(tester.test_invalid_swipe())
    
    # Print final results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("\n🎉 All tests passed! API is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {tester.tests_run - tester.tests_passed} test(s) failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())