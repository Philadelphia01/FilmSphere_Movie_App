const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const databaseConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database");
    client.release();
  } catch (err) {
    console.error("Error connecting to PostgreSQL database", err.message);
  }
};

module.exports = { pool, databaseConnection };
