// tests/posts.update.test.js
const request = require('supertest');
const app = require('../src/index');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Posts update & not-found tests', () => {
  test('PUT /posts/:id - update post title and content', async () => {
    // create author
    const { body: author } = await request(app)
      .post('/authors')
      .send({ name: 'Post Author', email: 'postauthor@example.com' })
      .expect(201);

    // create post
    const { body: post } = await request(app)
      .post('/posts')
      .send({ title: 'Original', content: 'Original content', authorId: author.id })
      .expect(201);

    // update
    const res = await request(app)
      .put(`/posts/${post.id}`)
      .send({ title: 'Updated Title', content: 'Updated content' })
      .expect(200);

    expect(res.body).toHaveProperty('id', post.id);
    expect(res.body.title).toBe('Updated Title');
    expect(res.body.content).toBe('Updated content');
  });

  test('PUT /posts/:id - 404 when post does not exist', async () => {
    await request(app)
      .put('/posts/999999')
      .send({ title: 'nope' })
      .expect(404);
  });

  test('GET /posts/:id - 404 when post not found', async () => {
    await request(app)
      .get('/posts/999999')
      .expect(404);
  });
});
