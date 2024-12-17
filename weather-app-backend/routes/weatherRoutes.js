const express = require('express');
const axios = require('axios');
const db = require('../db');  // Your db connection
const authenticateJWT = require('../middlewares/authenticateJWT');
const router = express.Router();

// Weather search
router.post('/', authenticateJWT, async (req, res) => {
  const { city } = req.body;

  const query = 'SELECT * FROM weather_searches WHERE city = ? AND user_id = ?';
  db.query(query, [city, req.user.id], async (err, results) => {
    if (err) return res.status(500).send('Error fetching weather report');

    if (results.length > 0) {
      return res.json(results[0]); // Return cached report
    }

    try {
      const weatherData = await axios.get(`http://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_API_KEY}&query=${city}`);
      const report = weatherData.data.current;

      if (!report || !report.temperature || !report.weather_descriptions) {
        return res.status(500).send('Invalid weather data from API');
      }

      const insertQuery = 'INSERT INTO weather_searches (user_id, city, temperature, description) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [req.user.id, city, report.temperature, report.weather_descriptions[0]], (err, result) => {
        if (err) return res.status(500).send('Error saving weather report');
        res.json({ city, temperature: report.temperature, description: report.weather_descriptions[0] });
      });
    } catch (apiError) {
      return res.status(500).send('Error fetching weather from API');
    }
  });
});

module.exports = router;
