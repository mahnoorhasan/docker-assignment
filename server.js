const express = require('express');
const fs      = require('fs');
const axios   = require('axios');
const app     = express();
const PORT    = 5000;
const CACHE_FILE = './cache/cache.json';

// Ensure cache file exists
if (!fs.existsSync(CACHE_FILE)) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({}), 'utf8');
}

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).send('Please provide ?city=');

  // Load cache
  const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));

  if (cache[city]) {
    return res.json({ source: 'cache', data: cache[city] });
  }

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      { params: { q: city, appid: apiKey } }
    );

    // Save to cache
    cache[city] = data;
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');

    res.json({ source: 'api', data });
  } catch (err) {
    res.status(500).json({ error: 'Weather API request failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
