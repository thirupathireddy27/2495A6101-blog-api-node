const { Author, Post } = require('../models');

async function createAuthor(req, res) {
  const { name, email } = req.body;
  const exists = await Author.findOne({ where: { email } });
  if (exists) return res.status(400).json({ error: 'email already exists' });
  const author = await Author.create({ name, email });
  res.status(201).json(author);
}

async function listAuthors(req, res) {
  const authors = await Author.findAll();
  res.json(authors);
}

async function getAuthor(req, res) {
  const id = parseInt(req.params.id, 10);
  const author = await Author.findByPk(id);
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author);
}

async function updateAuthor(req, res) {
  const id = parseInt(req.params.id, 10);
  const author = await Author.findByPk(id);
  if (!author) return res.status(404).json({ error: 'Author not found' });

  const { name, email } = req.body;
  if (email && email !== author.email) {
    const other = await Author.findOne({ where: { email } });
    if (other) return res.status(400).json({ error: 'email already in use' });
  }
  await author.update({ name: name ?? author.name, email: email ?? author.email });
  res.json(author);
}

async function deleteAuthor(req, res) {
  const id = parseInt(req.params.id, 10);
  const author = await Author.findByPk(id);
  if (!author) return res.status(404).json({ error: 'Author not found' });
  await author.destroy();
  res.status(204).send();
}

async function getPostsByAuthor(req, res) {
  const id = parseInt(req.params.id, 10);
  const author = await Author.findByPk(id, { include: [{ model: Post, as: 'posts' }] });
  if (!author) return res.status(404).json({ error: 'Author not found' });
  res.json(author.posts);
}

module.exports = { createAuthor, listAuthors, getAuthor, updateAuthor, deleteAuthor, getPostsByAuthor };
