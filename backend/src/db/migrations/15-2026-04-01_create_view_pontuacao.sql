-- View atualizada para calcular a média dos setores apenas no mês vigente
CREATE OR REPLACE VIEW `Pontuacao` AS 
SELECT 
    ROUND(AVG(v.Pontuacao), 1) AS Media_pontuacao, 
    s.nome AS Setor 
FROM Vistoria v 
JOIN Setor s ON s.id = v.id_Setor 
WHERE MONTH(v.Data_e_Hora) = MONTH(CURDATE()) 
  AND YEAR(v.Data_e_Hora) = YEAR(CURDATE())
GROUP BY s.id, s.nome;