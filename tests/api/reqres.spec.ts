import { test, expect } from '@playwright/test';

// reqres.in now requires a free API key: https://reqres.in  ->  export REQRES_API_KEY=xxxx
const KEY = process.env.REQRES_API_KEY;
test.skip(!KEY, 'Set REQRES_API_KEY (free key from reqres.in) to run API tests');
const headers = { 'x-api-key': KEY ?? '' };

const userShape = {
  id: expect.any(Number),
  email: expect.stringMatching(/^[^@\s]+@[^@\s]+\.[^@\s]+$/),
  first_name: expect.any(String),
  last_name: expect.any(String),
  avatar: expect.stringMatching(/^https?:\/\//),
};

test.describe('ReqRes API', () => {
  test('API-01 GET /api/users?page=2 returns paginated list', async ({ request }) => {
    const res = await request.get('/api/users?page=2', { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      page: 2,
      per_page: expect.any(Number),
      total: expect.any(Number),
      total_pages: expect.any(Number),
      data: expect.any(Array),
    });
    expect(body.data.length).toBeGreaterThan(0);
    for (const u of body.data) expect(u).toMatchObject(userShape);
  });

  test('API-02 GET /api/users/2 returns a single user', async ({ request }) => {
    const res = await request.get('/api/users/2', { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toMatchObject(userShape);
    expect(body.data.id).toBe(2);
  });

  test('API-03 GET /api/users/23 returns 404 with empty object', async ({ request }) => {
    const res = await request.get('/api/users/23', { headers });
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({});
  });

  test('API-04 POST /api/users creates a user', async ({ request }) => {
    const payload = { name: 'morpheus', job: 'leader' };
    const res = await request.post('/api/users', { headers, data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toMatchObject({
      name: 'morpheus',
      job: 'leader',
      id: expect.any(String),
      createdAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
  });

  test('API-05 POST /api/login success returns token', async ({ request }) => {
    const res = await request.post('/api/login', { headers, data: { email: 'eve.holt@reqres.in', password: 'cityslicka' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ token: expect.any(String) });
    expect(body.token.length).toBeGreaterThan(0);
  });

  test('API-06 POST /api/login missing password returns 400 + error', async ({ request }) => {
    const res = await request.post('/api/login', { headers, data: { email: 'peter@klaven' } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Missing password' });
  });

  test('API-07 POST /api/login missing email returns 400 + error', async ({ request }) => {
    const res = await request.post('/api/login', { headers, data: { password: 'cityslicka' } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: expect.stringContaining('Missing email') });
  });

  test('API-08 POST /api/register missing password returns 400', async ({ request }) => {
    const res = await request.post('/api/register', { headers, data: { email: 'sydney@fife' } });
    expect(res.status()).toBe(400);
    expect(await res.json()).toEqual({ error: 'Missing password' });
  });

  test('API-09 GET unknown resource returns 404', async ({ request }) => {
    const res = await request.get('/api/unknown/23', { headers });
    expect(res.status()).toBe(404);
    expect(await res.json()).toEqual({});
  });
});
