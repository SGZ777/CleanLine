import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';
import { PrismaClient } from '@prisma/client'; 

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();

export async function criarVistoriaMobile(req, res) {
  try {
    // =========================================================
    // LOGS DE DEPURAÇÃO PARA VERIFICAR NO RENDER
    // =========================================================
    console.log("====== INÍCIO DA REQUISIÇÃO MOBILE ======");
    console.log("Corpo da requisição (req.body):", req.body);
    console.log("Ficheiro recebido (req.file):", req.file ? "Imagem recebida com sucesso! Tamanho: " + req.file.size + " bytes" : "NENHUM FICHEIRO RECEBIDO");

    const { id_super, id_setor, pontuacao, q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;
    const file = req.file; 

    // Validação dos campos obrigatórios
    if (!id_super || !id_setor || !file) {
      console.log("ERRO DE VALIDAÇÃO: Faltam dados ou a imagem no envio.");
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

    console.log("A iniciar upload da imagem para o Cloudinary...");
    const cloudinaryResult = await uploadToCloudinary();
    const imageUrl = cloudinaryResult.secure_url; 
    console.log("Upload para o Cloudinary concluído! URL:", imageUrl);

    console.log("A guardar a vistoria na base de dados...");
    // Guardar na base de dados com a URL da imagem e os restantes dados
    const vistoria = await prisma.vistoria.create({
      data: {
        Id_Setor: parseInt(id_setor, 10),
        Id_Super: parseInt(id_super, 10),
        Id_Rota: 1, // valor padrão ou receba como parâmetro
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

    console.log("====== VISTORIA CRIADA COM SUCESSO! ID:", vistoria.Id, "======");
    return res.status(201).json({ message: 'Vistoria criada', id: vistoria.Id });

  } catch (error) {
    // Qualquer erro (seja do Prisma, do Cloudinary ou do código) vai cair aqui
    console.error('====== ERRO FATAL AO CRIAR VISTORIA ======', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}