import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import { nanoid } from 'nanoid';

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL database successfully!'))
  .catch(err => console.error('PostgreSQL Connection Error:', err.stack));

// Create URL table automatically if it doesn't exist
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
initDb();

// 1. Shorten URL Endpoint (Supports custom word codes & random fallback)
app.post('/api/shorten', async (req, res) => {
  const { originalUrl, customCode } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: 'Original URL is required' });
  }

  try {
    // Use custom word if provided, otherwise generate a 6-character random code
    const shortCode = customCode && customCode.trim() !== '' ? customCode.trim() : nanoid(6);

    // Check if the short code already exists in PostgreSQL
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

// 2. Redirect Endpoint
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      'SELECT original_url, clicks FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    const urlData = result.rows[0];

    // Increment click count
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