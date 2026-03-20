-- Alterações de todas as tabelas
-- Data: 20/03/2026


USE CleanLine;

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