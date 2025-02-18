-- CreateTable
CREATE TABLE `Encuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `fecha_encuesta` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `puntajeDesesperanza` INTEGER NOT NULL,
    `riesgoAlto` BOOLEAN NOT NULL,

    UNIQUE INDEX `Encuesta_usuario_id_key`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Respuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `encuestaId` INTEGER NOT NULL,
    `pregunta` VARCHAR(191) NOT NULL,
    `respuesta` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Encuesta` ADD CONSTRAINT `Encuesta_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Respuesta` ADD CONSTRAINT `Respuesta_encuestaId_fkey` FOREIGN KEY (`encuestaId`) REFERENCES `Encuesta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
