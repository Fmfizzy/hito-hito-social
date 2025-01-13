const postService = require('./posts.service');

class PostController {
    async getAllPosts(req, res) {
        try {
            const posts = await postService.getAllPosts();
            res.json(posts);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            res.status(500).json({ error: 'Failed to fetch posts' });
        }
    }

    async toggleLike(req, res) {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(401).json({ error: 'User must be authenticated' });
            }

            const isLiked = await postService.toggleLike(postId, userId);
            res.json({ isLiked });
        } catch (error) {
            console.error('Failed to toggle like:', error);
            res.status(500).json({ error: 'Failed to toggle like' });
        }
    }
}

module.exports = new PostController();
