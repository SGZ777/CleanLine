-- Criando a tabela Supervisor
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Supervisor`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `CPF` CHAR(11) NOT NULL,
    `Tel` CHAR(11) NOT NULL,
    `Estado` CHAR(2) NOT NULL,
    `Cidade` VARCHAR(255) NOT NULL,
    `Bairro` VARCHAR(255) NOT NULL,
    `Logradouro` VARCHAR(255) NOT NULL,
    `N` INT NOT NULL,
    `CEP` CHAR(8) NOT NULL
);