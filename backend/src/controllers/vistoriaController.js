import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

// ==========================================
// COLOQUE A FUNÇÃO AQUI (Fora da função principal)
// ==========================================
function converterNota(nota) {
  if (!nota) return null;
  
  // 1. Converte tudo para minúsculo, tira espaços e remove os acentos
  const textoLimpo = nota.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // 2. Relaciona a palavra limpa com a CHAVE EXATA do schema.prisma
  const mapaNotas = {
    'otimo': 'timo',       // a chave no Prisma é timo
    'bom': 'bom',          // a chave no Prisma é bom
    'ok': 'ok',            // a chave no Prisma é ok
    'ruim': 'ruim',        // a chave no Prisma é ruim
    'pessimo': 'p_ssimo'   // a chave no Prisma é p_ssimo
  };

  return mapaNotas[textoLimpo] || null; 
}
// ==========================================


// Aqui começa a sua função principal normal
export async function criarVistoriaMobile(req, res) {
  try {
    const { id_super, id_setor, pontuacao, q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;
    const file = req.file; 

    if (!id_super || !id_setor || !file) {
      return res.status(400).json({ error: 'Supervisor, setor e imagem são obrigatórios' });
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'vistorias',
            resource_type: 'image',
            transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const cloudinaryResult = await uploadToCloudinary();
    const imageUrl = cloudinaryResult.secure_url; 

    // Guardar na base de dados USANDO A FUNÇÃO DE CONVERSÃO para cada "q"
    const vistoria = await prisma.vistoria.create({
      data: {
        Id_Setor: parseInt(id_setor, 10),
        Id_Super: parseInt(id_super, 10),
        Id_Rota: 1, 
        Image: imageUrl,
        Pontuacao: pontuacao ? parseFloat(pontuacao) : 0,
        Data_e_Hora: new Date(),
        q1: converterNota(q1), 
        q2: converterNota(q2), 
        q3: converterNota(q3), 
        q4: converterNota(q4), 
        q5: converterNota(q5), 
        q6: converterNota(q6), 
        q7: converterNota(q7), 
        q8: converterNota(q8),
      },
    });

    console.log("====== VISTORIA CRIADA COM SUCESSO! ID:", vistoria.Id, "======");
    return res.status(201).json({ message: 'Vistoria criada', id: vistoria.Id });

  } catch (error) {
    console.error('====== ERRO FATAL AO CRIAR VISTORIA ======', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}