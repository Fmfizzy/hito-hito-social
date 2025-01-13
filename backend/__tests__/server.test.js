const request = require('supertest');
const express = require('express');

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




