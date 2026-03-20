-- Criando a tabela Setor
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Setor`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Limp` INT NOT NULL,
    `Id_Nfc` VARCHAR(1023) NOT NULL,
    `Nome` VARCHAR(255) NOT NULL
);