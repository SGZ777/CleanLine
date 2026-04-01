-- Criando a view para ver pontuação
-- Data: 01/04/2026


CREATE view `Pontuacao` as 
select AVG(v.Pontuacao) as Media_pontuacao, s.nome as Setor 
from vistoria v 
join Setor s on s.id = v.id_Setor 
group by s.id, s.nome;

