const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?sslmode=require",
});

module.exports = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM survey_responses ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
};