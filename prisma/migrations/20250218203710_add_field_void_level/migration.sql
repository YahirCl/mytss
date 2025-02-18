-- AlterTable
ALTER TABLE `publicacion` ADD COLUMN `nivel_vacio` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `usuario` ADD COLUMN `usuario_especial` BOOLEAN NOT NULL DEFAULT false;
