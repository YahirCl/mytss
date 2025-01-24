-- AlterTable
ALTER TABLE `publicacion` ADD COLUMN `emocion` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `contenido` VARCHAR(191) NOT NULL DEFAULT '';
