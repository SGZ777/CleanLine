-- Alterando as tabelas adicionando os status
-- Data: 15/04/2026

-- Adicionar coluna status (se ainda não existir)
ALTER TABLE ADM ADD COLUMN status ENUM('ativo','inativo') DEFAULT 'ativo' NOT NULL;
ALTER TABLE Supervisor ADD COLUMN status ENUM('ativo','inativo') DEFAULT 'ativo' NOT NULL;
ALTER TABLE Func_Limpeza ADD COLUMN status ENUM('ativo','inativo') DEFAULT 'ativo' NOT NULL;