const request = require('supertest');
const app = require('../src/index');
const { sequelize, Author, Post } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('creating post with non-existent author returns 400', async () => {
  const res = await request(app)
    .post('/posts')
    .send({ title: 't', content: 'c', authorId: 9999 });
  expect(res.status).toBe(400);
  expect(res.body.error).toBeDefined();
});

test('delete author cascades posts', async () => {
  const author = await Author.create({ name: 'T', email: 't@example.com' });
  const post = await Post.create({ title: 'p', content: 'c', authorId: author.id });
  let found = await Post.findByPk(post.id);
  expect(found).not.toBeNull();

  const res = await request(app).delete(`/authors/${author.id}`);
  expect(res.status).toBe(204);

  found = await Post.findByPk(post.id);
  expect(found).toBeNull();
});
