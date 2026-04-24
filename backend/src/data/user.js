import pool from '../db/connection.js';

export async function getADMById(id) {
  const [rows] = await pool.query('SELECT id, Nome, Email FROM ADM WHERE id = ?', [id]);
  return rows[0] ?? null;
}
