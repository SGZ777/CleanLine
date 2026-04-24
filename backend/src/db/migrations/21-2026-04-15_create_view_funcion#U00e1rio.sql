-- Criando a view dos funcionários
-- Data: 10/04/2026

CREATE OR REPLACE VIEW vw_funcionarios AS
SELECT 
    id,
    Nome,
    'Administrador' COLLATE utf8mb4_unicode_ci AS Cargo,
    'Administrativo' COLLATE utf8mb4_unicode_ci AS Setor,
    Email,
    Tel,
    'ADM' COLLATE utf8mb4_unicode_ci AS Tipo,
    status
FROM ADM
WHERE status = 'ativo'

UNION ALL

SELECT 
    id,
    Nome,
    'Supervisor' COLLATE utf8mb4_unicode_ci AS Cargo,
    'Operacional' COLLATE utf8mb4_unicode_ci AS Setor,
    Email,
    Tel,
    'Supervisor' COLLATE utf8mb4_unicode_ci AS Tipo,
    status
FROM Supervisor
WHERE status = 'ativo'

UNION ALL

SELECT 
    f.id,
    f.Nome,
    'Funcionário de Limpeza' COLLATE utf8mb4_unicode_ci AS Cargo,
    COALESCE(el.Nome, 'Sem equipe') COLLATE utf8mb4_unicode_ci AS Setor,
    f.Email,
    f.Tel,
    'Func_Limpeza' COLLATE utf8mb4_unicode_ci AS Tipo,
    f.status
FROM Func_Limpeza f
LEFT JOIN Equipe_Limpeza el ON f.Id_Equipe = el.Id
WHERE f.status = 'ativo';