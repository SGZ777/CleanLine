import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

const SECRET_KEY = process.env.JWT_SECRET || 'chave-secreta-super-segura-cleanline';

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const user = await prisma.aDM.findUnique({
      where: { Email: email },
    });

    if (!user) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, user.Senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: user.id, role: 'admin' }, SECRET_KEY, {
      expiresIn: '8h',
    });

    return res.status(200).json({
      mensagem: 'Sucesso',
      token,
      user: { id: user.id, name: user.Nome, email: user.Email },
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}

export async function getUser(req, res) {
  try {
    const adm = await prisma.aDM.findUnique({
      where: { id: req.user.id },
      select: { id: true, Nome: true, Email: true },
    });

    if (!adm) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json({
      user: { id: adm.id, name: adm.Nome, email: adm.Email },
    });
  } catch (error) {
    console.error('Erro ao buscar administrador:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}