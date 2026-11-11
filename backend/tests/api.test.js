const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting API Verification Tests against', BASE_URL);
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('\n--- 1. Testing Health Endpoint ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200, 'Health check returns 200');
    assert(healthJson.status === 'online', 'Health status is online');

    // 2. Auth: Register
    console.log('\n--- 2. Testing User Registration ---');
    const testEmail = `explorer_${Date.now()}@worldly.atlas`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Amelia Earhart',
        email: testEmail,
        password: 'password123',
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201, 'Registration returns 201 Created');
    assert(!!regJson.token, 'Registration returns JWT token');
    const token = regJson.token;

    // 3. Auth: Login
    console.log('\n--- 3. Testing User Login ---');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200, 'Login returns 200 OK');
    assert(loginJson.user.email === testEmail, 'User profile returned correctly');

    // 4. Auth: Profile /me
    console.log('\n--- 4. Testing Authenticated /me ---');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200, '/me returns 200 OK');
    assert(meJson.user.name === 'Amelia Earhart', 'User name matches');

    // 5. Tasks: Create Task
    console.log('\n--- 5. Testing Task Creation (POST /tasks) ---');
    const createTaskRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: 'Survey Great Barrier Reef ecological baseline',
        description: 'Collect remote sensing telemetry for coral reef biodiversity.',
        countryId: 'australia',
        category: 'research',
        priority: 'high',
        status: 'pending',
      }),
    });
    const createTaskJson = await createTaskRes.json();
    assert(createTaskRes.status === 201, 'Task created with 201 Created');
    assert(createTaskJson.task.countryId === 'australia', 'Task countryId stored properly');
    const taskId = createTaskJson.task._id;

    // 6. Tasks: List Tasks
    console.log('\n--- 6. Testing Task Retrieval (GET /tasks) ---');
    const listTasksRes = await fetch(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listTasksJson = await listTasksRes.json();
    assert(listTasksRes.status === 200, 'Tasks list returns 200 OK');
    assert(listTasksJson.tasks.length >= 1, 'Tasks array has at least 1 item');

    // 7. Tasks: Get Single Task
    console.log('\n--- 7. Testing Get Task by ID (GET /tasks/:id) ---');
    const getTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getTaskJson = await getTaskRes.json();
    assert(getTaskRes.status === 200, 'Single task retrieved returns 200 OK');
    assert(getTaskJson.task.title === 'Survey Great Barrier Reef ecological baseline', 'Task title matches');

    // 8. Tasks: Update Task
    console.log('\n--- 8. Testing Task Update (PUT /tasks/:id) ---');
    const updateTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: 'in_progress',
        priority: 'urgent',
      }),
    });
    const updateTaskJson = await updateTaskRes.json();
    assert(updateTaskRes.status === 200, 'Task updated returns 200 OK');
    assert(updateTaskJson.task.status === 'in_progress', 'Task status updated to in_progress');
    assert(updateTaskJson.task.priority === 'urgent', 'Task priority updated to urgent');

    // 9. Tasks: Delete Task
    console.log('\n--- 9. Testing Task Deletion (DELETE /tasks/:id) ---');
    const deleteTaskRes = await fetch(`${BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteTaskJson = await deleteTaskRes.json();
    assert(deleteTaskRes.status === 200, 'Task deleted returns 200 OK');
    assert(deleteTaskJson.deletedTaskId === taskId, 'Deleted ID matches');

    // 10. Countries API
    console.log('\n--- 10. Testing Countries API (GET /countries) ---');
    const countriesRes = await fetch(`${BASE_URL}/countries`);
    const countriesJson = await countriesRes.json();
    assert(countriesRes.status === 200, 'Countries list returns 200 OK');
    assert(countriesJson.countries.length >= 10, 'Countries list populated with seeded data');

    const countryRes = await fetch(`${BASE_URL}/countries/japan`);
    const countryJson = await countryRes.json();
    assert(countryRes.status === 200, 'Single country /japan returns 200 OK');
    assert(countryJson.country.name === 'Japan', 'Country name is Japan');

    // 11. Bookmarks API
    console.log('\n--- 11. Testing Bookmarks API ---');
    const addBookmarkRes = await fetch(`${BASE_URL}/bookmarks/brazil`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const addBookmarkJson = await addBookmarkRes.json();
    assert(addBookmarkRes.status === 201, 'Bookmark added with 201');

    const listBookmarksRes = await fetch(`${BASE_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBookmarksJson = await listBookmarksRes.json();
    assert(listBookmarksJson.countryIds.includes('brazil'), 'Bookmark list includes brazil');

    // 12. Quiz API
    console.log('\n--- 12. Testing Quiz API ---');
    const quizRes = await fetch(`${BASE_URL}/quiz/daily`);
    const quizJson = await quizRes.json();
    assert(quizRes.status === 200, 'Quiz daily questions return 200 OK');
    assert(quizJson.questions.length > 0, 'Quiz questions array has items');

    const answerRes = await fetch(`${BASE_URL}/quiz/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        questionId: 'q1',
        optionId: 'b',
      }),
    });
    const answerJson = await answerRes.json();
    assert(answerRes.status === 200, 'Answer endpoint returns 200 OK');
    assert(answerJson.correct === true, 'Answer correctly scored as Chile');

    console.log(`\n================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`================================`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('❌ Test execution error:', err);
    process.exit(1);
  }
}

runTests();

