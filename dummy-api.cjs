// Local dummy API server for testing
// Run with: node dummy-api.cjs

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Dummy data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

const posts = [
  { id: 1, title: 'First Post', content: 'Hello World!', userId: 1 },
  { id: 2, title: 'Second Post', content: 'Testing API', userId: 2 }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/users', (req, res) => {
  res.json({ users, total: users.length });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name || 'Unknown',
    email: req.body.email || 'unknown@example.com',
    role: req.body.role || 'user'
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = req.body.role || user.role;
  
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  
  users.splice(index, 1);
  res.status(204).send();
});

app.get('/posts', (req, res) => {
  res.json({ posts, total: posts.length });
});

app.get('/error/400', (req, res) => {
  res.status(400).json({ error: 'Bad Request', message: 'Invalid parameters' });
});

app.get('/error/500', (req, res) => {
  res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong' });
});

app.get('/slow', (req, res) => {
  setTimeout(() => {
    res.json({ message: 'This response took 3 seconds', delay: '3000ms' });
  }, 3000);
});

app.listen(PORT, () => {
  console.log(`🎯 Dummy API server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  GET    /health');
  console.log('  GET    /users');
  console.log('  GET    /users/:id');
  console.log('  POST   /users');
  console.log('  PUT    /users/:id');
  console.log('  DELETE /users/:id');
  console.log('  GET    /posts');
  console.log('  GET    /error/400');
  console.log('  GET    /error/500');
  console.log('  GET    /slow');
});