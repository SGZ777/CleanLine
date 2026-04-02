-- Criando a tabela Func_Limpeza
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Func_Limpeza`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Equipe` INT NOT NULL,
    `Nome` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL,
    `Email` VARCHAR(255) NOT NULL
);