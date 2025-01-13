const request = require('supertest');
const { PrismaClient } = require('@prisma/client');
const express = require('express');
const postRoutes = require('../posts/posts.routes');

const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

const prisma = new PrismaClient();

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    post: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: '1',
          imageUrl: 'test-image.jpg',
          author: {
            name: 'Test User',
            image: 'test-avatar.jpg'
          },
          likes: []
        }
      ])
    },
    like: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: '1' }),
      delete: jest.fn()
    }
  }))
}));

describe('Posts API', () => {
  describe('GET /api/posts', () => {
    it('should return all posts', async () => {
      const response = await request(app).get('/api/posts');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body[0]).toHaveProperty('imageUrl');
      expect(response.body[0]).toHaveProperty('author');
    });
  });

  describe('POST /api/posts/:postId/toggle-like', () => {
    it('should toggle like on a post', async () => {
      const response = await request(app)
        .post('/api/posts/1/toggle-like')
        .send({ userId: 'test-user-id' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isLiked');
    });

    it('should return 401 when userId is not provided', async () => {
      const response = await request(app)
        .post('/api/posts/1/toggle-like')
        .send({});

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });
});
