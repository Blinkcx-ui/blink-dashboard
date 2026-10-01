const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
    const { username, password } = req.body;
    
    try {
        const { rows } = await pool.query('SELECT username, role, branch_id FROM app_users WHERE username = $1 AND password_hash = $2', [username, password]);
        if (rows.length > 0) {
            res.status(200).json({ success: true, user: rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة (Invalid credentials)' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};