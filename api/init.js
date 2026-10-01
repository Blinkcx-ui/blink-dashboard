const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

module.exports = async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL,
                branch_id VARCHAR(50)
            );
            
            INSERT INTO app_users (username, password_hash, role, branch_id)
            VALUES ('Taha', 'admin123', 'admin', NULL)
            ON CONFLICT (username) DO NOTHING;

            CREATE TABLE IF NOT EXISTS survey_responses (
                id SERIAL PRIMARY KEY,
                branch_id VARCHAR(50) NOT NULL,
                survey_type VARCHAR(100),
                speed_score INT,
                accuracy_score INT,
                quality_score INT,
                hospitality_score INT,
                cleanliness_score INT,
                loyalty_score INT,
                overall_score INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        res.status(200).send("SUCCESS! The database is fully connected and tables are built. You can go log in now.");
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
};