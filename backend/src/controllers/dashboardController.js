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
    const resultMax = await prisma.$queryRaw`
      SELECT ROUND(MAX("Pontuacao")::numeric, 1) AS "MaiorNota"
      FROM "Vistoria"
      WHERE DATE("Data_e_Hora") = CURRENT_DATE
    `;

    let maiorNota = resultMax[0]?.MaiorNota ?? null;
    let dataDia = null;

    if (maiorNota != null) {
      dataDia = 'CURRENT_DATE';
    } else {
      const resultFallback = await prisma.$queryRaw`
        SELECT ROUND(MAX("Pontuacao")::numeric, 1) AS "MaiorNota", DATE(MAX("Data_e_Hora")) AS "DataDia"
        FROM "Vistoria"
      `;
      maiorNota = resultFallback[0]?.MaiorNota ?? 0;
      dataDia = resultFallback[0]?.DataDia ?? null;
    }

    let setor = null;
    if (maiorNota != null && dataDia != null) {
      const setorRows =
        dataDia === 'CURRENT_DATE'
          ? await prisma.$queryRaw`
              SELECT s."Nome" AS "Setor"
              FROM "Vistoria" v
              JOIN "Setor" s ON v."Id_Setor" = s.id
              WHERE DATE(v."Data_e_Hora") = CURRENT_DATE
                AND ROUND(v."Pontuacao"::numeric, 1) = ${maiorNota}
              ORDER BY v."Data_e_Hora" DESC
              LIMIT 1
            `
          : await prisma.$queryRaw`
              SELECT s."Nome" AS "Setor"
              FROM "Vistoria" v
              JOIN "Setor" s ON v."Id_Setor" = s.id
              WHERE DATE(v."Data_e_Hora") = ${dataDia}
                AND ROUND(v."Pontuacao"::numeric, 1) = ${maiorNota}
              ORDER BY v."Data_e_Hora" DESC
              LIMIT 1
            `;
      setor = setorRows[0]?.Setor ?? null;
    }

    return res.status(200).json({ maiorNota: Number(maiorNota), setor });
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

export async function getGraficoSetoresMensal(_req, res) {
  try {
    const dados = await prisma.$queryRaw`
      SELECT 
        s."Nome" AS setor,
        EXTRACT(YEAR FROM v."Data_e_Hora")::text 
          || '-' 
          || LPAD(EXTRACT(MONTH FROM v."Data_e_Hora")::text, 2, '0') AS mes,
        ROUND(AVG(v."Pontuacao")::numeric, 1) AS media
      FROM "Vistoria" v
      JOIN "Setor" s ON s.id = v."Id_Setor"
      WHERE v."Data_e_Hora" >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 months'
        AND v."Data_e_Hora" <= CURRENT_DATE + INTERVAL '1 day'
      GROUP BY s.id, s."Nome", mes
      ORDER BY s."Nome", mes
    `;
    return res.status(200).json({ dados });
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico de setores:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}

export async function getDistribuicaoNotasEquipes(_req, res) {
  try {
    const dados = await prisma.$queryRaw`
      SELECT
        el."Nome" AS equipe,
        CASE
          WHEN v."Pontuacao" <= 4 THEN '0-4'
          WHEN v."Pontuacao" <= 6.9 THEN '4.1-6.9'
          ELSE '7-10'
        END AS faixa,
        COUNT(*)::int AS quantidade
      FROM "Vistoria" v
      JOIN "Setor" s ON s.id = v."Id_Setor"
      JOIN "Equipe_Limpeza" el ON el."Id" = s."Id_Limp"
      GROUP BY el."Nome", faixa
      ORDER BY el."Nome", faixa
    `;
    return res.status(200).json({ dados });
  } catch (error) {
    console.error('Erro ao buscar distribuição de notas:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}
export async function getChecklistsHoje(_req, res) {
  try {
    const setores = await prisma.$queryRaw`
      SELECT
        s.id,
        s."Nome" AS setor,
        v."Pontuacao" AS nota,
        v."Image" AS imagem,
        v."q1", v."q2", v."q3", v."q4",
        v."q5", v."q6", v."q7", v."q8"
      FROM "Setor" s
      LEFT JOIN LATERAL (
        SELECT "Pontuacao", "Image",
               "q1", "q2", "q3", "q4",
               "q5", "q6", "q7", "q8"
        FROM "Vistoria"
        WHERE "Id_Setor" = s.id
          AND DATE("Data_e_Hora") = CURRENT_DATE
        ORDER BY "Data_e_Hora" DESC
        LIMIT 1
      ) v ON true
      ORDER BY s."Nome"
    `;
    return res.status(200).json(setores);
  } catch (error) {
    console.error('Erro ao buscar checklists do dia:', error);
    return res.status(500).json({ error: 'Erro interno' });
  }
}