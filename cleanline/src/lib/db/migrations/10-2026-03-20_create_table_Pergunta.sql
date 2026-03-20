-- Criando a tabela Pergunta
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Pergunta`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` BIGINT NOT NULL,
    `Elaboracao` VARCHAR(255) NOT NULL
);