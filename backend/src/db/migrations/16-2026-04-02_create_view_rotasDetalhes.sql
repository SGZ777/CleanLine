-- Criando a view para ver detalhes das rotas
-- Data: 02/04/2026
CREATE VIEW `Rota_Detalhes` AS
SELECT 
    r.Nome_Rota         AS Rota,
    s.Nome              AS Setor,
    el.Nome             AS Equipe_Limpeza,
    sup.Nome            AS Supervisor
FROM SetorRota sr
INNER JOIN Rota           r   ON r.id   = sr.Id_Rota
INNER JOIN Setor          s   ON s.id   = sr.Id_Setor
INNER JOIN Equipe_Limpeza el  ON el.Id  = s.Id_Limp
INNER JOIN Supervisor     sup ON sup.id  = r.Id_Adm;

select * from Rota;