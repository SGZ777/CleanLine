import { NextResponse } from 'next/server';
const InspecaoController = require('../../../lib/controllers/InspecaoController');

export async function POST(request) {
  try {
    const data = await request.json();

    // Validar dados recebidos (setor_id, user_id, itens_5s)
    const { setor_id, user_id, itens_5s } = data;

    if (!setor_id || !user_id || !itens_5s) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
    }

    // Criar inspeção usando o controller
    const inspecaoId = await InspecaoController.createInspecao(data);

    return NextResponse.json({ message: 'Inspeção criada com sucesso', id: inspecaoId });
  } catch (error) {
    console.error('Erro ao criar inspeção:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const setor_id = searchParams.get('setor_id');

    let inspecoes;
    if (setor_id) {
      inspecoes = await InspecaoController.getInspecoesBySetor(setor_id);
    } else {
      inspecoes = await InspecaoController.getAllInspecoes();
    }

    return NextResponse.json({ inspecoes });
  } catch (error) {
    console.error('Erro ao buscar inspeções:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}