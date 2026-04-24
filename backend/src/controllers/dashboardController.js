import prisma from '../../prisma/client.js';

export async function getMediaMensal(_req, res) {
  try {
    const result = await prisma.$queryRaw`
      SELECT ROUND(AVG("Pontuacao")::numeric, 1) AS "MediaMensal"
      FROM "Vistoria"
      WHERE EXTRACT(MONTH FROM "Data_e_Hora") = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM "Data_e_Hora") = EXTRACT(YEAR FROM CURRENT_DATE)
    `;
    const nota = result[0]?.MediaMensal || 0;
    return res.status(200).json({ MediaMensal: Number(nota) });
  } catch (error) {
    console.error('Erro na API media-mensal:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getMaiorNotaDia(_req, res) {
  try {
    const result = await prisma.$queryRaw`
      SELECT MAX("Pontuacao") AS "MaiorNotaDoDia"
      FROM "Vistoria"
      WHERE DATE("Data_e_Hora") = CURRENT_DATE
    `;
    const nota = result[0]?.MaiorNotaDoDia || 0;
    return res.status(200).json({ maiorNota: Number(nota).toFixed(1) });
  } catch (error) {
    console.error('Erro na API maior-nota-dia:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getGraficoPontuacaoMensal(_req, res) {
  try {
    const rows = await prisma.$queryRaw`
      SELECT 
        DATE("Data_e_Hora") AS data,
        ROUND(AVG("Pontuacao")::numeric, 1) AS media
      FROM "Vistoria"
      WHERE 
        EXTRACT(MONTH FROM "Data_e_Hora") = EXTRACT(MONTH FROM CURRENT_DATE) AND
        EXTRACT(YEAR FROM "Data_e_Hora") = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY DATE("Data_e_Hora")
      ORDER BY data ASC
    `;
    return res.status(200).json({ dados: rows });
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getRankingDoMes(_req, res) {
  try {
    const rows = await prisma.$queryRaw`
      SELECT 
        s."Nome" AS "NomeSetor", 
        ROUND(AVG(v."Pontuacao")::numeric, 1) AS "MediaNota"
      FROM "Vistoria" v
      JOIN "Setor" s ON v."Id_Setor" = s.id
      WHERE 
        EXTRACT(MONTH FROM v."Data_e_Hora") = EXTRACT(MONTH FROM CURRENT_DATE) AND
        EXTRACT(YEAR FROM v."Data_e_Hora") = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY s.id, s."Nome"
      ORDER BY "MediaNota" DESC
      LIMIT 3
    `;
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar o ranking:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}