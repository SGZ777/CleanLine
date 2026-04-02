-- Criando a view para pegar a média de pontuação por equipe de limpeza
-- Data: 02/04/2026

CREATE VIEW `vw_Media_Equipe` AS
SELECT 
    el.Nome             AS Equipe,
    AVG(v.Pontuacao)    AS Media_Pontuacao
FROM Vistoria v
INNER JOIN Setor          s  ON s.id  = v.Id_Setor
INNER JOIN Equipe_Limpeza el ON el.Id = s.Id_Limp
GROUP BY el.Id, el.Nome;