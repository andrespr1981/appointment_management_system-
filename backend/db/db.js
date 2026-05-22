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

export async function registerConsult(operacion, table, use_query) {
    try {
        const query = `INSERT INTO consultas(tipo_operacion,tabla_afectada,query_text) 
                        VALUES (?,?,?);`
        const [rows] = await pool.query(query, [operacion, table, use_query])
        if (rows.affectedRows > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function registerUserLogin(id_user, email, success, device, tenant_id) {
    try {
        const query = `INSERT INTO login_usuarios(id_usuario,correo,exito,dispositivo,tenant_id)
        VALUES(?,?,?,?,?)`
        const [rows] = await pool.query(query, [id_user, email, success, device, tenant_id])
        if (rows.affectedRows > 0) {
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}

export default pool;