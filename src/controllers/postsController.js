const { Post, Author } = require('../models');

async function createPost(req, res) {
  const { title, content, authorId } = req.body;
  const author = await Author.findByPk(authorId);
  if (!author) return res.status(400).json({ error: 'authorId does not exist' });

  const post = await Post.create({ title, content, authorId });
  const result = await Post.findByPk(post.id, { include: [{ model: Author, as: 'author', attributes: ['id','name','email'] }] });
  res.status(201).json(result);
}

async function listPosts(req, res) {
  const authorId = req.query.authorId ? parseInt(req.query.authorId, 10) : undefined;
  const query = {
    include: [{ model: Author, as: 'author', attributes: ['id','name','email'] }]
  };
  if (authorId) query.where = { authorId };
  const posts = await Post.findAll(query);
  res.json(posts);
}

async function getPost(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = await Post.findByPk(id, { include: [{ model: Author, as: 'author', attributes: ['id','name','email'] }] });
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
}

async function updatePost(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = await Post.findByPk(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { title, content } = req.body;
  await post.update({ title: title ?? post.title, content: content ?? post.content });
  const updated = await Post.findByPk(id, { include: [{ model: Author, as: 'author', attributes: ['id','name','email'] }] });
  res.json(updated);
}

async function deletePost(req, res) {
  const id = parseInt(req.params.id, 10);
  const post = await Post.findByPk(id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  await post.destroy();
  res.status(204).send();
}

module.exports = { createPost, listPosts, getPost, updatePost, deletePost };
