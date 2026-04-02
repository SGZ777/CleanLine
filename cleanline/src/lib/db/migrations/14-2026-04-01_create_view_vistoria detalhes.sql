-- Criando a view para detalhar a vistoria
-- Data: 01/04/2026

CREATE VIEW `detalhes_vistoria` AS
SELECT
    v.Id                        AS Id_Vistoria,
    v.Data_e_Hora               AS Data_e_Hora,
    v.Pontuacao                 AS Nota,
    v.Image                     AS Imagem,
    s.Nome                      AS Setor,
    r.Nome_Rota                 AS Rota,
    sup.Nome                    AS Supervisor,
    sup.Email                   AS Email_Supervisor,
    el.Nome                     AS Equipe_Limpeza,
    p.Enunciado                 AS Pergunta,
    rv.Resposta                 AS Resposta

FROM `Vistoria` v
    INNER JOIN `Setor`          s   ON s.id   = v.Id_Setor
    INNER JOIN `Rota`           r   ON r.id   = v.Id_Rota
    INNER JOIN `Supervisor`     sup ON sup.id  = v.Id_Super
    INNER JOIN `Equipe_Limpeza` el  ON el.Id  = s.Id_Limp
    INNER JOIN `RespostaVistoria` rv ON rv.Id_vistoria = v.Id
    INNER JOIN `Pergunta`       p   ON p.id   = rv.id_pergunta;


-- Como deve ser usado no back

-- const rows = await db.query(
--     `SELECT * FROM vw_detalhes_vistoria WHERE Id_Vistoria = ?`, [id]
-- );

-- // Agrupa as perguntas/respostas em um único objeto
-- const vistoria = {
--     id:             rows[0].Id_Vistoria,
--     data:           rows[0].Data_e_Hora,
--     nota:           rows[0].Nota,
--     imagem:         rows[0].Imagem,
--     setor:          rows[0].Setor,
--     rota:           rows[0].Rota,
--     supervisor:     rows[0].Supervisor,
--     equipe:         rows[0].Equipe_Limpeza,
--     respostas: rows.map(row => ({
--         pergunta: row.Pergunta,
--         resposta: row.Resposta
--     }))
-- };

