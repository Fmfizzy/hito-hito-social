const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class PostService {
    async getAllPosts() {
        return await prisma.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                likes: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true
                            }
                        }
                    }
                }
            }
        });
    }

    async toggleLike(postId, userId) {
        const existingLike = await prisma.like.findFirst({
            where: {
                postId: postId,
                userId: userId
            }
        });

        if (existingLike) {
            await prisma.like.delete({
                where: {
                    id: existingLike.id
                }
            });
            return false; // when unliked
        } else {
            await prisma.like.create({
                data: {
                    postId: postId,
                    userId: userId
                }
            });
            return true; // when liked
        }
    }
}

module.exports = new PostService();
