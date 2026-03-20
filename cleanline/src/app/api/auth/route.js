import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import jwt from 'jsonwebtoken'; // <<< Importamos o JWT

// Essa chave secreta idealmente ficaria no seu .env.local (ex: JWT_SECRET=suachave)
const SECRET_KEY = process.env.JWT_SECRET 

export async function POST(request) {
  try {
    const { email, senha } = await request.json();
    
    const filePath = path.join(process.cwd(), 'src', 'lib', 'db', 'users.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const db = JSON.parse(fileData);

    const user = db.users.find(u => u.email === email && u.senha === senha);

    if (!user) {
      return NextResponse.json({ erro: 'Email ou senha incorretos' }, { status: 401 });
    }

    // <<< A MÁGICA DO JWT ACONTECE AQUI >>>
    // Criamos o token com o ID e a Role do cara, válido por 8 horas
    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      SECRET_KEY, 
      { expiresIn: '8h' }
    );

    // De
    return NextResponse.json({ mensagem: 'Sucesso', token }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ erro: 'Erro no servidor' }, { status: 500 });
  }
}