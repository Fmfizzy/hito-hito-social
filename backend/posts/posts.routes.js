const express = require('express');
const router = express.Router();
const postController = require('./posts.controller');

router.get('/', postController.getAllPosts.bind(postController));
router.post('/:postId/toggle-like', postController.toggleLike.bind(postController));

module.exports = router;
