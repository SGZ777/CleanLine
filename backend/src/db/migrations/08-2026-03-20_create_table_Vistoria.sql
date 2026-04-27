-- Criando a tabela Vistoria
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `Vistoria`(
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` INT NOT NULL,
    `Id_Super` INT NOT NULL,
    `Id_Rota` INT NOT NULL,
    `Image` VARCHAR(255) NOT NULL,
    `Pontuacao` DECIMAL(10, 2) NOT NULL,
    `Data_e_Hora` DATETIME NOT NULL
);