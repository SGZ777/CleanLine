import { NextResponse } from 'next/server';
const pool = require('../../../lib/db/connection');

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Verificar credenciais no banco
    const query = 'SELECT id, username FROM users WHERE username = ? AND password = ?';
    const [rows] = await pool.execute(query, [username, password]);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const user = rows[0];

    // Aqui você pode gerar um token JWT se quiser
    // Por enquanto, retornamos apenas o usuário
    return NextResponse.json({ user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}