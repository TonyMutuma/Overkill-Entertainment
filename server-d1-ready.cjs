const express = require('express');
const { Client } = require('@cloudflare/d1-adapter'); // Example adapter or proxying
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// If D1_TOKEN is provided, proxy requests to Cloudflare D1 Rest API
// otherwise fall back to local SQLite.
const USE_REMOTE_D1 = !!process.env.CLOUDFLARE_D1_TOKEN;

async function executeQuery(sql, params = []) {
  if (USE_REMOTE_D1) {
    // Logic to call Cloudflare D1 REST API via D1_TOKEN + DATABASE_ID
    const url = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_DATABASE_ID}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${process.env.CLOUDFLARE_D1_TOKEN}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ sql, params })
    });
    return await res.json();
  } else {
    // Local SQLite fallback
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve({ results: rows });
      });
    });
  }
}

app.get('/api/mix-tracks', async (req, res) => {
  try {
    const data = await executeQuery('SELECT * FROM mix_tracks');
    res.json(data.results || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => console.log('Server running on port 4000 (D1 Ready)'));
