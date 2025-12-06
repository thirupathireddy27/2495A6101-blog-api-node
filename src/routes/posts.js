const express = require('express');
const router = express.Router();
const handleValidation = require('../utils/handleValidation');
const validators = require('../utils/validators');
const ctrl = require('../controllers/postsController');

router.post('/', validators.createPost, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.createPost(req,res);
});
router.get('/', ctrl.listPosts);
router.get('/:id', validators.idParam, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.getPost(req,res);
});
router.put('/:id', validators.idParam.concat(validators.updatePost), (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.updatePost(req,res);
});
router.delete('/:id', validators.idParam, (req,res) => {
  if (!handleValidation(req,res)) return;
  return ctrl.deletePost(req,res);
});

module.exports = router;
