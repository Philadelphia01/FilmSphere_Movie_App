const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "filmsphere",
  user: process.env.DB_USER || "postgres",
  password: String(process.env.DB_PASSWORD),
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
