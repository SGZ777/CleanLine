CREATE DATABASE CleanLine;
USE CleanLine;

CREATE TABLE `ADM`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Senha` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL
);
CREATE TABLE `Supervisor`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Equipe` INT NOT NULL,
    `Nome` VARCHAR(255) NOT NULL,
    `Tel` CHAR(11) NOT NULL,
    `Email` VARCHAR(255) NOT NULL
);
CREATE TABLE `Rota`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Adm` INT NOT NULL,
    `Nome_Rota` VARCHAR(255) NOT NULL
);
CREATE TABLE `Setor`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Limp` INT NOT NULL,
    `Id_Nfc` VARCHAR(1023) NOT NULL,
    `Nome` VARCHAR(255) NOT NULL
);
CREATE TABLE `SetorRota`(
    `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Rota` INT NOT NULL,
    `Id_Setor` INT NOT NULL
);
CREATE TABLE `Vistoria`(
    `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` INT NOT NULL,
    `Id_Super` INT NOT NULL,
    `Id_Rota` INT NOT NULL,
    `Image` VARCHAR(255) NOT NULL,
    `Pontuacao` DECIMAL(10, 2) NOT NULL,
    `Data_e_Hora` DATETIME NOT NULL
);
CREATE TABLE `Equipe_Limpeza`(
    `Id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Nome` VARCHAR(255) NOT NULL
);
CREATE TABLE `RespostaVistoria`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Vistoria` INT NOT NULL,
    `Id_Pergunta` VARCHAR(255) NOT NULL,
    `Resposta` VARCHAR(255) NOT NULL
);
CREATE TABLE `Pergunta`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `Id_Setor` BIGINT NOT NULL,
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