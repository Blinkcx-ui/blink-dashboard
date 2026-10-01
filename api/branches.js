const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
    // 1. RECEIVE NEW SURVEY DATA (Webhook)
    if (req.method === 'POST') {
        try {
            const { branch_id, overall_score, speed_score, accuracy_score, quality_score } = req.body;
            await pool.query(
                `INSERT INTO survey_responses 
                (branch_id, overall_score, speed_score, accuracy_score, quality_score) 
                VALUES ($1, $2, $3, $4, $5)`,
                [branch_id, overall_score, speed_score, accuracy_score, quality_score]
            );
            return res.status(200).json({ success: true, message: 'Survey saved successfully' });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    // 2. SEND DATA TO DASHBOARD (Heatmap)
    try {
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