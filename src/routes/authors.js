const express = require('express');
const router = express.Router();
const handleValidation = require('../utils/handleValidation');
const validators = require('../utils/validators');
const ctrl = require('../controllers/authorsController');

router.post('/', validators.createAuthor, (req, res) => {
  if (!handleValidation(req, res)) return;
  return ctrl.createAuthor(req, res);
});
router.get('/', ctrl.listAuthors);
router.get('/:id', validators.idParam, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.getAuthor(req,res);
});
router.put('/:id', validators.idParam.concat(validators.updateAuthor), (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.updateAuthor(req,res);
});
router.delete('/:id', validators.idParam, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.deleteAuthor(req,res);
});
router.get('/:id/posts', validators.idParam, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.getPostsByAuthor(req,res);
});

module.exports = router;
