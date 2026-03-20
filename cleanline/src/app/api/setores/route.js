import { NextResponse } from 'next/server';
const pool = require('../../../lib/db/connection');

export async function GET(request) {
  try {
    const query = 'SELECT id, nome, tag_nfc FROM setores';
    const [rows] = await pool.execute(query);

    return NextResponse.json({ setores: rows });
  } catch (error) {
    console.error('Erro ao buscar setores:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { nome, tag_nfc } = await request.json();

    if (!nome || !tag_nfc) {
      return NextResponse.json({ error: 'Nome e tag NFC são obrigatórios' }, { status: 400 });
    }

    const query = 'INSERT INTO setores (nome, tag_nfc) VALUES (?, ?)';
    const [result] = await pool.execute(query, [nome, tag_nfc]);

    return NextResponse.json({ message: 'Setor criado com sucesso', id: result.insertId });
  } catch (error) {
    console.error('Erro ao criar setor:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}