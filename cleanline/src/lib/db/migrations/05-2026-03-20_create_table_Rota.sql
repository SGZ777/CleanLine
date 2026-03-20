-- Criando a tabela Rota
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Rota`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Adm` INT NOT NULL,
    `Nome_Rota` VARCHAR(255) NOT NULL
);