-- Criando a tabela ADM
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `ADM`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL
);