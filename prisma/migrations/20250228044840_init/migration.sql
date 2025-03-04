-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` VARCHAR(191) NOT NULL,
    `nombre_usuario` VARCHAR(191) NOT NULL,
    `nombre_completo` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avatar_url` VARCHAR(191) NULL,
    `img_cover_url` VARCHAR(191) NULL,
    `sexo` BOOLEAN NULL,
    `fechaNacimiento` DATETIME(3) NULL,
    `carrera` VARCHAR(191) NULL,
    `siguiendo` INTEGER NOT NULL DEFAULT 0,
    `seguidores` INTEGER NOT NULL DEFAULT 0,
    `usuario_especial` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Usuario_uid_key`(`uid`),
    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publicacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `contenido` VARCHAR(191) NOT NULL DEFAULT '',
    `emocion` VARCHAR(191) NOT NULL DEFAULT '',
    `fecha_publicacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `likes` INTEGER NOT NULL DEFAULT 0,
    `reposts` INTEGER NOT NULL DEFAULT 0,
    `alertas` INTEGER NOT NULL DEFAULT 0,
    `nivel_vacio` VARCHAR(191) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Interaccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NOT NULL,
    `tipo_interaccion` VARCHAR(191) NOT NULL,
    `fecha_interaccion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comentario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `publicacion_id` INTEGER NOT NULL,
    `contenido` VARCHAR(191) NOT NULL,
    `fecha_comentario` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Seguidor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `seguidor_uid` VARCHAR(191) NOT NULL,
    `seguido_uid` VARCHAR(191) NOT NULL,
    `fecha_seguimiento` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Seguidor_seguidor_uid_seguido_uid_key`(`seguidor_uid`, `seguido_uid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `Publicacion` ADD CONSTRAINT `Publicacion_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interaccion` ADD CONSTRAINT `Interaccion_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Interaccion` ADD CONSTRAINT `Interaccion_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `Publicacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comentario` ADD CONSTRAINT `Comentario_publicacion_id_fkey` FOREIGN KEY (`publicacion_id`) REFERENCES `Publicacion`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seguidor` ADD CONSTRAINT `Seguidor_seguidor_uid_fkey` FOREIGN KEY (`seguidor_uid`) REFERENCES `Usuario`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seguidor` ADD CONSTRAINT `Seguidor_seguido_uid_fkey` FOREIGN KEY (`seguido_uid`) REFERENCES `Usuario`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Encuesta` ADD CONSTRAINT `Encuesta_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Respuesta` ADD CONSTRAINT `Respuesta_encuestaId_fkey` FOREIGN KEY (`encuestaId`) REFERENCES `Encuesta`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
