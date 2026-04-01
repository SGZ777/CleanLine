import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken'; // <<< Importamos o JWT
import bcrypt from 'bcryptjs';

// Essa chave secreta idealmente ficaria no seu .env.local (ex: JWT_SECRET=suachave)
const SECRET_KEY = process.env.JWT_SECRET 

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
      //busca ↓
   const [rows] = await pool.query(
      'SELECT id, nome, role FROM usuarios WHERE email = ? AND senha = ?', 
      [email, senha]
    );

    if ( rows.length === 0){
      return NextResponse.json ({erro: 'Email ou senha incorretos'}), { status: 401}
    }

    const user = rows[0]

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if(!senhaValida){
      return NextResponse.json ({erro: 'Email ou senha incorretos'}), { status: 401}
    }

    // <<< A MÁGICA DO JWT ACONTECE AQUI >>>
    // Criamos o token com o ID e a Role do cara, válido por 8 horas
    const token = jwt.sign(
      { id: user.id, role: 'admin' }, 
      SECRET_KEY, 
      { expiresIn: '8h' }
    );

    // De
    return NextResponse.json({ mensagem: 'Sucesso', token }, { status: 200 });

  } catch (error) {
    console.error("Erro no login com o banco: ", error)
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}