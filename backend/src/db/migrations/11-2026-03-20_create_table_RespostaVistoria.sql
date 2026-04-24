-- Criando a tabela RespostaVistoria
-- Data: 20/03/2026


USE CleanLine;

CREATE TABLE `RespostaVistoria`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Vistoria` INT NOT NULL,
    `Id_Pergunta` VARCHAR(255) NOT NULL,
    `Resposta` VARCHAR(255) NOT NULL
);