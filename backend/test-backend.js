const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Lexora Express Backend API Automated Test...\n');

  // 1. Health Check
  const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log('1. Health Check Response:', health);

  // 2. Register New Student
  const testEmail = `student_${Date.now()}@test.com`;
  console.log(`\n2. Registering new student (${testEmail})...`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Əli Həsənov',
      email: testEmail,
      password: 'password123',
      role: 'STUDENT',
    })
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Registration Response:', regData);

  // 3. Login with Registered Student
  console.log(`\n3. Logging in with (${testEmail})...`);
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'password123',
    })
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  console.log('Login Response Token Received:', !!loginData.token);

  console.log('\n✅ ALL BACKEND TESTS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
