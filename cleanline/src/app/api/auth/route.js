import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
   
    const body = await request.json();
    const { email, senha } = body;

   
    const filePath = path.join(process.cwd(), 'src', 'lib', 'db', 'users.json');
    
    //transforma em json
    const fileData = await fs.readFile(filePath, 'utf-8');
    const db = JSON.parse(fileData);

   
    const user = db.users.find(u => u.email === email && u.senha === senha);

    
    if (!user) {
      return NextResponse.json({ erro: 'Email ou senha incorretos' }, { status: 401 });
    }

    
    return NextResponse.json({ 
      mensagem: 'Login feito com sucesso!', 
      user: { 
        id: user.id, 
        nome: user.nome, 
        cargo: user.cargo
      } 
    }, { status: 200 });

  } catch (error) {
    console.error("Erro na rota de login:", error);
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}