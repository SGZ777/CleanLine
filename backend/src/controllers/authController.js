import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/client.js';

const DEFAULT_JWT_SECRET = 'fdbhjeanuivreauvreuif4ui398f389f3ivojdcnjkvdnjksad@@fdfsfsmmhmjsfsdvxcxcvx';

function getJwtSecret() {
  return process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const user = await prisma.aDM.findFirst({
      where: { Email: email },
    });

    if (!user) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const senhaValida = await bcrypt.compare(senha, user.Senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Email ou senha incorretos' });
    }

    const token = jwt.sign({ id: user.id, role: 'admin' }, getJwtSecret(), {
      expiresIn: '8h',
    });

    // Apenas retorna o token no corpo – SEM cookies
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
    return res.status(401).json({ error: 'Token invalido ou expirado' });
  }
}

export function logout(_req, res) {
  return res.status(200).json({ mensagem: 'Logout realizado com sucesso' });
}

export async function loginMobile(req, res) {
  try {
    const { email, senha } = req.body;

    const user = await prisma.supervisor.findFirst({
      where: { Email: email }
    });

    if (!user) {
      return res.status(401).json({ erro: 'Email incorreto' });
    }

    const senhaValida = await bcrypt.compare(senha, user.Senha);

    if (senhaValida) {
      // 1. GERAR O TOKEN JWT (Passando o ID e a role/status para bater com a rota de Perfil)
      // Usamos getJwtSecret() para garantir que é a MESMA chave do middleware
      const token = jwt.sign(
        {
          id: user.id,
          role: user.status // Passa o status (ex: 'admin' ou 'supervisor') para validar na rota
        },
        getJwtSecret(),
        { expiresIn: '30d' } // Expira em 30 dias
      );

      // 2. Injeta o token dentro do próprio objeto de resposta para o Android ler
      const respostaMobile = {
        ...user,
        token: token // Agora o Android vai conseguir salvar o token de verdade!
      };

      // Remove a senha por segurança antes de mandar para o app
      delete respostaMobile.Senha;

      return res.json(respostaMobile);

    } else {
      return res.status(401).json({ message: "Senha incorreta" });
    }

  } catch (error) {
    console.error('Erro no login mobile:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
}
