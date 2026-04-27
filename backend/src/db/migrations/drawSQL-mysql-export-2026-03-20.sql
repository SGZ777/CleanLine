CREATE DATABASE CleanLine;
USE CleanLine;

CREATE TABLE `ADM`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL
);
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
CREATE TABLE `Func_Limpeza`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Equipe` INT,
    `Nome` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL,
    `Email` VARCHAR(255) NOT NULL
);
CREATE TABLE `Rota`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Adm` INT,
    `Nome_Rota` VARCHAR(255) NOT NULL
);
CREATE TABLE `Setor`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Limp` INT,
    `Id_Nfc` VARCHAR(1023),
    `Nome` VARCHAR(255) NOT NULL
);
CREATE TABLE `SetorRota`(
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Rota` INT,
    `Id_Setor` INT
);
CREATE TABLE `Vistoria`(
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` INT,
    `Id_Super` INT,
    `Id_Rota` INT,
    `Image` VARCHAR(255) NOT NULL,
    `Pontuacao` DECIMAL(10, 2) NOT NULL,
    `Data_e_Hora` DATETIME NOT NULL
);
CREATE TABLE `Equipe_Limpeza`(
    `Id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL
);
CREATE TABLE `RespostaVistoria`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Vistoria` INT,
    `Id_Pergunta` INT,
    `Resposta` VARCHAR(255) NOT NULL
);
CREATE TABLE `Pergunta`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` INT,
    `Elaboracao` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `SetorRota` ADD CONSTRAINT `setorrota_id_setor_foreign` FOREIGN KEY(`Id_Setor`) REFERENCES `Setor`(`id`);
ALTER TABLE
    `Rota` ADD CONSTRAINT `rota_id_adm_foreign` FOREIGN KEY(`Id_Adm`) REFERENCES `ADM`(`id`);
ALTER TABLE
    `Pergunta` ADD CONSTRAINT `pergunta_id_setor_foreign` FOREIGN KEY(`Id_Setor`) REFERENCES `Setor`(`id`);
ALTER TABLE
    `Vistoria` ADD CONSTRAINT `vistoria_id_super_foreign` FOREIGN KEY(`Id_Super`) REFERENCES `Supervisor`(`id`);
ALTER TABLE
    `Vistoria` ADD CONSTRAINT `vistoria_id_setor_foreign` FOREIGN KEY(`Id_Setor`) REFERENCES `Setor`(`id`);
ALTER TABLE
    `RespostaVistoria` ADD CONSTRAINT `respostavistoria_id_vistoria_foreign` FOREIGN KEY(`Id_Vistoria`) REFERENCES `Vistoria`(`Id`);
ALTER TABLE
    `Vistoria` ADD CONSTRAINT `vistoria_id_rota_foreign` FOREIGN KEY(`Id_Rota`) REFERENCES `Rota`(`id`);
ALTER TABLE
    `SetorRota` ADD CONSTRAINT `setorrota_id_rota_foreign` FOREIGN KEY(`Id_Rota`) REFERENCES `Rota`(`id`);
ALTER TABLE
    `Setor` ADD CONSTRAINT `setor_id_limp_foreign` FOREIGN KEY(`Id_Limp`) REFERENCES `Equipe_Limpeza`(`Id`);
ALTER TABLE
    `RespostaVistoria` ADD CONSTRAINT `respostavistoria_id_pergunta_foreign` FOREIGN KEY(`Id_Pergunta`) REFERENCES `Pergunta`(`id`);
ALTER TABLE
    `Func_Limpeza` ADD CONSTRAINT `func_limpeza_id_equipe_foreign` FOREIGN KEY(`Id_Equipe`) REFERENCES `Equipe_Limpeza`(`Id`);
    
insert into adm (Nome, Email, Senha, Tel) values ("Mateus s fugikawa", "adm@cleanline.com", "$2b$10$jcL0sg6RSdFO7wiGhOpmtevaphgzSTZWCt3S755XA9tirZbXd7GpK", "0012345789");

