const { body, param } = require('express-validator');

const createAuthor = [
  body('name').exists().withMessage('name is required'),
  body('email').exists().withMessage('email is required').isEmail().withMessage('invalid email')
];

const updateAuthor = [
  body('name').optional(),
  body('email').optional().isEmail().withMessage('invalid email')
];

const createPost = [
  body('title').exists().withMessage('title is required'),
  body('content').exists().withMessage('content is required'),
  body('authorId').exists().withMessage('authorId is required').isInt().withMessage('authorId must be integer')
];

const updatePost = [
  body('title').optional(),
  body('content').optional()
];

const idParam = [ param('id').isInt().withMessage('id must be integer') ];

module.exports = { createAuthor, updateAuthor, createPost, updatePost, idParam };
