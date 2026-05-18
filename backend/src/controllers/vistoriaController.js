import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

export async function criarVistoriaMobile(req, res) {
  try {
    const { id_super, id_setor, pontuacao, q1, q2, q3, q4, q5, q6, q7, q8 } = req.body;
    const file = req.file; // arquivo enviado via multipart

    if (!id_super || !id_setor || !file) {
      return res.status(400).json({ error: 'Supervisor, setor e imagem são obrigatórios' });
    }

    // Função que faz o upload para o Cloudinary usando a stream do buffer
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'vistorias',          // pasta no Cloudinary
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
        // Converte o buffer do multer em stream e envia para o Cloudinary
        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const cloudinaryResult = await uploadToCloudinary();
    const imageUrl = cloudinaryResult.secure_url; // URL pública da imagem

    // Salvar no banco com a URL da imagem e os demais dados
    const vistoria = await prisma.vistoria.create({
      data: {
        Id_Setor: parseInt(id_setor),
        Id_Super: parseInt(id_super),
        Id_Rota: 1, // valor padrão ou receba como parâmetro
        Image: imageUrl,
        Pontuacao: pontuacao ? parseFloat(pontuacao) : 0,
        Data_e_Hora: new Date(),
        q1, q2, q3, q4, q5, q6, q7, q8,
      },
    });

    return res.status(201).json({ message: 'Vistoria criada', id: vistoria.Id });
  } catch (error) {
    console.error('Erro ao criar vistoria:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}