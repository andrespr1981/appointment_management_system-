import { pool, registerConsult } from '../db.js'

export async function getRoles(tenant_id) {
    try {
        const query = 'SELECT id_rol,nombre_rol FROM roles WHERE tenant_id = ?;'
        const [rows] = await pool.query(query, [tenant_id])
        await registerConsult('SELECT', 'roles', query, String(tenant_id))
        return { success: true, roles: rows }
    } catch (e) {
        return { success: false }
    }
}

export async function createRol(name, tenant_id) {
    try {
        const query = 'INSERT INTO roles(nombre_rol,tenant_id) VALUES (?,?) '
        const [rows] = await pool.query(query, [name, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('INSERT', 'roles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function updateRol(id_rol, name, tenant_id) {
    try {
        const query = `UPDATE Roles SET 
                        nombre_rol = ?
                        WHERE id_rol = ? AND
                        tenant_id = ?;
                    `
        const [rows] = await pool.query(query, [name, id_rol, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('UPDATE', 'roles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}

export async function deleteRol(id_rol, tenant_id) {
    try {
        const query = ` DELETE FROM roles WHERE id_rol = ? AND tenant_id = ?;
                    `
        const [rows] = await pool.query(query, [id_rol, tenant_id])
        if (rows.affectedRows > 0) {
            await registerConsult('DELETE', 'roles', query)
            return { success: true }
        }
        return { success: false }
    } catch (e) {
        return { success: false, error: e }
    }
}