const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
    try {
        // Fetches real averages based on incoming survey submissions
        const { rows } = await pool.query(`
            SELECT 
                branch_id, 
                COUNT(*) as total_surveys,
                ROUND(AVG(overall_score)) as overall_score,
                ROUND(AVG(speed_score)) as speed_score,
                ROUND(AVG(accuracy_score)) as accuracy_score,
                ROUND(AVG(quality_score)) as quality_score
            FROM survey_responses 
            GROUP BY branch_id
        `);
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};