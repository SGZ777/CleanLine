-- Criando as views para as estatísticas do dashboard
-- Data: 10/04/2026


CREATE OR REPLACE VIEW `vw_Media_Mensal` AS
SELECT 
    ROUND(AVG(Pontuacao), 1) AS MediaMensal
FROM Vistoria
WHERE MONTH(Data_e_Hora) = MONTH(CURDATE()) 
  AND YEAR(Data_e_Hora) = YEAR(CURDATE());

CREATE OR REPLACE VIEW `vw_Maior_Nota_Dia` AS
SELECT 
    MAX(Pontuacao) AS MaiorNotaDoDia
FROM Vistoria
WHERE DATE(Data_e_Hora) = CURDATE();

CREATE OR REPLACE VIEW `vw_Ranking_Mes` AS
SELECT 
    s.Nome AS NomeSetor, 
    ROUND(AVG(v.Pontuacao), 1) AS MediaNota
FROM Vistoria v
JOIN Setor s ON v.Id_Setor = s.id
WHERE MONTH(v.Data_e_Hora) = MONTH(CURDATE()) 
  AND YEAR(v.Data_e_Hora) = YEAR(CURDATE())
GROUP BY s.id, s.Nome
ORDER BY MediaNota DESC
LIMIT 3;