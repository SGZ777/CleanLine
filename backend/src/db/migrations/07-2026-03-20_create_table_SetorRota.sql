-- Criando a tabela SetorRota
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `SetorRota`(
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Rota` INT NOT NULL,
    `Id_Setor` INT NOT NULL
);