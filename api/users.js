const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { username, password, role, branch_id } = req.body;
    
    try {
        await pool.query('INSERT INTO app_users (username, password_hash, role, branch_id) VALUES ($1, $2, $3, $4)', 
        [username, password, role, branch_id || null]);
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};