"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const isProduction = process.env.NODE_ENV === "production";
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
exports.pool.query("SELECT current_database()")
    .then(res => console.log("Connected to database:", res.rows[0].current_database))
    .catch(err => console.error("DB Connection Error:", err));
