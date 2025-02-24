-- DropForeignKey
ALTER TABLE `comentario` DROP FOREIGN KEY `Comentario_publicacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `interaccion` DROP FOREIGN KEY `Interaccion_publicacion_id_fkey`;

-- DropIndex
DROP INDEX `Comentario_publicacion_id_fkey` ON `comentario`;

-- DropIndex
DROP INDEX `Interaccion_publicacion_id_fkey` ON `interaccion`;

-- AddForeignKey
ALTER TABLE `Interaccion` ADD CONSTRAINT `Interaccion_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `Publicacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `Publicacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
