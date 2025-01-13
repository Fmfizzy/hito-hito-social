const request = require('supertest');
const express = require('express');
const profileRoutes = require('../profile/profile.routes');

const app = express();
app.use(express.json());
app.use('/api/users', profileRoutes);

// Mock Prisma Client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      update: jest.fn().mockImplementation((args) => {
        if (args.where.id === 'valid-user-id') {
          return Promise.resolve({
            id: 'valid-user-id',
            username: 'testuser',
            fullName: args.data.fullName,
            image: args.data.image,
            email: 'test@example.com'
          });
        }
        const error = new Error('Record to update not found');
        error.code = 'P2025';
        throw error;
      })
    }
  }))
}));

describe('Profile API', () => {
  let consoleErrorSpy;
  
  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('PATCH /api/users/:userId', () => {
    it('should update user profile successfully', async () => {
      const response = await request(app)
        .patch('/api/users/valid-user-id')
        .send({
          fullName: 'Updated Full Name',
          image: 'new-avatar.jpg'
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('fullName', 'Updated Full Name');
      expect(response.body.user).toHaveProperty('image', 'new-avatar.jpg');
    });

    it('should return 400 when fullName is not provided', async () => {
      const response = await request(app)
        .patch('/api/users/valid-user-id')
        .send({
          image: 'new-avatar.jpg'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Full name is required');
    });

    it('should return 404 when user is not found', async () => {
      const response = await request(app)
        .patch('/api/users/invalid-user-id')
        .send({
          fullName: 'Updated Full Name',
          image: 'new-avatar.jpg'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });
});
