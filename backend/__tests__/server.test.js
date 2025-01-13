const request = require('supertest');
const express = require('express');
const postRoutes = require('../posts/posts.routes');

const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

describe('GET /api/hello', () => {
  it('responds with json message', async () => {
    const response = await request(app).get('/api/hello');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from the backend!');
  });
});

describe('GET /api/posts', () => {
  it('should return an array of posts', async () => {
    const response = await request(app).get('/api/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Check if posts have the required properties
    if (response.body.length > 0) {
      const post = response.body[0];
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('imageUrl');
      expect(post).toHaveProperty('author');
      expect(post).toHaveProperty('likes');
    }
  });
});




