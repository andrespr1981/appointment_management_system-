import mysql from 'mysql2'
import dotenv from "dotenv";

dotenv.config()

export const pool = mysql.createPool(
    {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: false,
    }

).promise()

async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM usuarios')
    console.log(rows)
}

export default pool;