const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// LowDB setup
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

async function initDB(){
  await db.read();
  db.data ||= { users: [], tables: [], audit: [] };
  await db.write();
}
initDB();

// Simple auth (demo only)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  // demo: accept any non-empty
  if (email && password) {
    return res.json({ token: 'demo-token', user: { id: 'u1', email } });
  }
  res.status(400).json({ error: 'email and password required' });
});

// Users endpoints
app.get('/api/users', async (req,res) => {
  await db.read();
  res.json(db.data.users);
});
app.post('/api/users', async (req,res) => {
  await db.read();
  const u = { id: nanoid(), ...req.body };
  db.data.users.push(u);
  await db.write();
  res.json(u);
});
app.delete('/api/users/:id', async (req,res) => {
  await db.read();
  db.data.users = db.data.users.filter(x => x.id !== req.params.id);
  await db.write();
  res.json({ ok: true });
});

// Tables endpoints (very simple)
app.get('/api/tables', async (req,res) => {
  await db.read();
  res.json(db.data.tables);
});
app.post('/api/tables', async (req,res) => {
  await db.read();
  const t = { id: nanoid(), ...req.body };
  db.data.tables.push(t);
  await db.write();
  res.json(t);
});

// Audit log
app.get('/api/audit', async (req,res) => {
  await db.read();
  res.json(db.data.audit);
});
app.post('/api/audit', async (req,res) => {
  await db.read();
  const e = { id: nanoid(), timestamp: Date.now(), ...req.body };
  db.data.audit.push(e);
  await db.write();
  res.json(e);
});

// Serve static build (if present)
const staticDir = path.join(__dirname, '..', 'dist');
app.use(express.static(staticDir));
app.get('*', (req,res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));