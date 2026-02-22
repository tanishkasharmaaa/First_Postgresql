import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT current_database()")
  .then(res => console.log("Connected to database:", res.rows[0].current_database))
  .catch(err => console.error("DB Connection Error:", err));