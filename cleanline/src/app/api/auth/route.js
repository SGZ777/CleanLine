import { NextResponse } from 'next/server';
import pool from '@/lib/db/connection'; // <<< É ESSA LINHA QUE PUXA O SEU POOL! (ajuste o caminho se sua pasta for diferente)
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-cleanline';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
    
    
    const [rows] = await pool.query(
      'SELECT id, Nome, Senha FROM ADM WHERE Email = ?', 
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ erro: 'Email ou senha incorretos' }, { status: 401 });
    }

    const user = rows[0];

    // Compara a senha q veio do front end com a do hash
    const senhaValida = await bcrypt.compare(senha, user.Senha);

    if (!senhaValida) {
      return NextResponse.json({ erro: 'Email ou senha incorretos' }, { status: 401 });
    }

    // gera o token forçando o role a adm
    const token = jwt.sign(
      { id: user.id, role: 'admin' }, 
      SECRET_KEY, 
      { expiresIn: '8h' }
    );

    return NextResponse.json({ mensagem: 'Sucesso', token }, { status: 200 });

  } catch (error) {
    console.error("Erro no login com banco:", error);
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}