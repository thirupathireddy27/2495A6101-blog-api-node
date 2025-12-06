// tests/authors.test.js
const request = require('supertest');
const app = require('../src/index'); // expects src/index.js to export the express app
const { sequelize } = require('../src/models');

beforeAll(async () => {
  // Ensure DB is migrated/ready for tests. If your test environment auto-handles it, this is safe.
  // If migrations are handled externally, you can remove this.
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Authors API', () => {
  test('PUT /authors/:id - update author and return 200', async () => {
    // create author
    const { body: created } = await request(app)
      .post('/authors')
      .send({ name: 'Test A', email: 'testa@example.com' })
      .expect(201);

    const res = await request(app)
      .put(`/authors/${created.id}`)
      .send({ name: 'Test A Updated', email: 'testa_updated@example.com' })
      .expect(200);

    expect(res.body).toHaveProperty('id', created.id);
    expect(res.body).toHaveProperty('name', 'Test A Updated');
    expect(res.body).toHaveProperty('email', 'testa_updated@example.com');
  });

  test('PUT /authors/:id - updating email to existing email returns 400', async () => {
    // create two authors
    const { body: a1 } = await request(app)
      .post('/authors')
      .send({ name: 'A1', email: 'a1@example.com' })
      .expect(201);

    const { body: a2 } = await request(app)
      .post('/authors')
      .send({ name: 'A2', email: 'a2@example.com' })
      .expect(201);

    // try to update a2's email to a1's email -> should fail (400)
    const res = await request(app)
      .put(`/authors/${a2.id}`)
      .send({ email: 'a1@example.com' })
      .expect(400);

    expect(res.body).toHaveProperty('error');
  });

  test('GET /authors/:id - 404 when not found', async () => {
    await request(app)
      .get('/authors/99999')
      .expect(404);
  });
});
