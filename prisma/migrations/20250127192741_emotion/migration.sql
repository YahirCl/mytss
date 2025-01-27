/*
  Warnings:

  - A unique constraint covering the columns `[usuario_id,publicacion_id]` on the table `Interaccion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Interaccion_usuario_id_publicacion_id_key` ON `Interaccion`(`usuario_id`, `publicacion_id`);
