import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
// CORREÇÃO: Importa diretamente do pacote oficial do Prisma, sem depender de caminhos de pastas
import { PrismaClient } from '@prisma/client'; 

// Inicializa o cliente do Prisma para ser usado nas funções abaixo
const prisma = new PrismaClient();

export async function criarVistoriaMobile(req, res) {
  try {
    const { id_super, id_setor, pontuacao, q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;
    const file = req.file; 

    // Validação dos campos obrigatórios
    if (!id_super || !id_setor || !file) {
      return res.status(400).json({ error: 'Supervisor, setor e imagem são obrigatórios' });
    }

    // Função que faz o upload para o Cloudinary usando a stream do buffer
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'vistorias',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
            ]
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

    // Salvar no banco com a URL da imagem e os demais dados
    const vistoria = await prisma.vistoria.create({
      data: {
        Id_Setor: parseInt(id_setor, 10),
        Id_Super: parseInt(id_super, 10),
        Id_Rota: 1, 
        Image: imageUrl,
        Pontuacao: pontuacao ? parseFloat(pontuacao) : 0,
        Data_e_Hora: new Date(),
        q1: q1 || null, 
        q2: q2 || null, 
        q3: q3 || null, 
        q4: q4 || null, 
        q5: q5 || null, 
        q6: q6 || null, 
        q7: q7 || null, 
        q8: q8 || null,
      },
    });

    return res.status(201).json({ message: 'Vistoria criada', id: vistoria.Id });
  } catch (error) {
    console.error('Erro ao criar vistoria:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}