import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import { nanoid } from 'nanoid';

dotenv.config();
const { Pool } = pkg;

const app = express();

// Enable CORS for frontend communication
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// PostgreSQL Connection Pool
// Defaults to container hostname 'database' inside the Docker network
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:your_password@database:5432/url_shortener',
});

// Auto-create URL table on boot
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(50) UNIQUE NOT NULL,
        clicks INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database table verified/created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

// Retry PostgreSQL connection until container/DNS is fully ready
const connectWithRetry = async (retries = 5, delay = 3000) => {
  while (retries) {
    try {
      await pool.connect();
      console.log('Connected to PostgreSQL database successfully!');
      await initDb();
      break;
    } catch (err) {
      console.error(`PostgreSQL Connection Error (retries left: ${retries - 1}):`, err.message);
      retries -= 1;
      if (retries === 0) process.exit(1);
      await new Promise(res => setTimeout(res, delay));
    }
  }
};

connectWithRetry();

// 0. Root Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'URL Shortener API is running successfully!'
  });
});

// 1. Shorten URL Endpoint
app.post('/api/shorten', async (req, res) => {
  let { originalUrl, customCode } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  // Prepend http:// if standard protocol is missing
  if (!/^https?:\/\//i.test(originalUrl)) {
    originalUrl = 'http://' + originalUrl;
  }

  try {
    const shortCode = customCode && customCode.trim() !== '' ? customCode.trim() : nanoid(6);

    const existing = await pool.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'This short code is already taken. Try another one.' });
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const shortUrl = `${baseUrl}/${shortCode}`;

    await pool.query(
      'INSERT INTO urls (original_url, short_code) VALUES ($1, $2)',
      [originalUrl, shortCode]
    );

    res.status(201).json({
      originalUrl,
      shortCode,
      shortUrl
    });
  } catch (err) {
    console.error('Error saving URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. Fetch Stats Endpoint
app.get('/api/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. Redirect Endpoint (Catch-all route, must remain at bottom)
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const urlData = result.rows[0];

    // Increment click counter
    await pool.query(
      'UPDATE urls SET clicks = clicks + 1 WHERE short_code = $1',
      [shortCode]
    );

    return res.redirect(urlData.original_url);
  } catch (err) {
    console.error('Error redirecting URL:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});