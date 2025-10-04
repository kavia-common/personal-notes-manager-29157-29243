const request = require('supertest');
const app = require('../src/app');

/**
 * Integration tests for Notes CRUD using in-memory repository fallback.
 * These tests exercise the API in the following order:
 *  - POST /api/notes (201) with valid payload
 *  - GET /api/notes/:id (200) for created note
 *  - GET /api/notes (200) and verify the created note is in the list
 *  - PUT /api/notes/:id (200) with updated fields
 *  - DELETE /api/notes/:id (204)
 *  - GET /api/notes/:id (404) after deletion
 * Also includes negative cases:
 *  - POST /api/notes with invalid payloads (400)
 *  - PUT /api/notes/:id with invalid payloads (400)
 *  - GET/PUT/DELETE non-existent id (404)
 */

describe('Notes API (integration)', () => {
  let createdId = null;

  test('POST /api/notes should create a note and return 201 with note body', async () => {
    const payload = { title: 'First Note', content: 'This is the first note.' };
    const res = await request(app).post('/api/notes').send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');

    const note = res.body.data;
    expect(typeof note.id).toBe('string');
    expect(note.id.length).toBeGreaterThan(0);
    expect(note.title).toBe('First Note');
    expect(note.content).toBe('This is the first note.');
    expect(typeof note.createdAt).toBe('string');
    expect(typeof note.updatedAt).toBe('string');

    createdId = note.id;
  });

  test('GET /api/notes/:id should return the created note (200)', async () => {
    const res = await request(app).get(`/api/notes/${createdId}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');

    const note = res.body.data;
    expect(note.id).toBe(createdId);
    expect(note.title).toBe('First Note');
    expect(note.content).toBe('This is the first note.');
    expect(typeof note.createdAt).toBe('string');
    expect(typeof note.updatedAt).toBe('string');
  });

  test('GET /api/notes should list notes and include the created note (200)', async () => {
    const res = await request(app).get('/api/notes');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(Array.isArray(res.body.data)).toBe(true);

    const found = res.body.data.find((n) => n.id === createdId);
    expect(found).toBeTruthy();
    expect(found.title).toBe('First Note');
    expect(found.content).toBe('This is the first note.');
  });

  test('PUT /api/notes/:id should update the note (200) with updated fields', async () => {
    const updatePayload = { title: 'Updated Title', content: 'Updated content.' };
    const res = await request(app).put(`/api/notes/${createdId}`).send(updatePayload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body).toHaveProperty('data');

    const note = res.body.data;
    expect(note.id).toBe(createdId);
    expect(note.title).toBe('Updated Title');
    expect(note.content).toBe('Updated content.');
    expect(typeof note.updatedAt).toBe('string');
  });

  test('DELETE /api/notes/:id should delete the note (204)', async () => {
    const res = await request(app).delete(`/api/notes/${createdId}`);
    expect(res.status).toBe(204);
    expect(res.text).toBe(''); // no content
  });

  test('GET /api/notes/:id after deletion should return 404', async () => {
    const res = await request(app).get(`/api/notes/${createdId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
    expect(typeof res.body.message).toBe('string');
  });

  // Negative cases

  test('POST /api/notes with missing fields should return 400', async () => {
    const res = await request(app).post('/api/notes').send({}); // missing title and content
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('POST /api/notes with empty strings should return 400', async () => {
    const res = await request(app).post('/api/notes').send({ title: '   ', content: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('PUT /api/notes/:id with no updatable fields should return 400', async () => {
    // First, create a fresh note to update
    const createRes = await request(app).post('/api/notes').send({ title: 'Note A', content: 'Body A' });
    expect(createRes.status).toBe(201);
    const id = createRes.body.data.id;

    const res = await request(app).put(`/api/notes/${id}`).send({}); // neither title nor content
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('status', 'error');
    expect(Array.isArray(res.body.details)).toBe(true);
  });

  test('GET /api/notes/:id with non-existent id should return 404', async () => {
    const res = await request(app).get('/api/notes/non-existent-id-12345');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });

  test('PUT /api/notes/:id with non-existent id should return 404', async () => {
    const res = await request(app).put('/api/notes/non-existent-id-12345').send({ title: 'X' });
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });

  test('DELETE /api/notes/:id with non-existent id should return 404', async () => {
    const res = await request(app).delete('/api/notes/non-existent-id-12345');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('status', 'error');
  });

  test('GET / should return health status 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
