/*
  Warnings:

  - You are about to drop the column `seguido_id` on the `seguidor` table. All the data in the column will be lost.
  - You are about to drop the column `seguidor_id` on the `seguidor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seguidor_uid,seguido_uid]` on the table `Seguidor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seguido_uid` to the `Seguidor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seguidor_uid` to the `Seguidor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `seguidor` DROP FOREIGN KEY `Seguidor_seguido_id_fkey`;

-- DropForeignKey
ALTER TABLE `seguidor` DROP FOREIGN KEY `Seguidor_seguidor_id_fkey`;

-- DropIndex
DROP INDEX `Seguidor_seguido_id_fkey` ON `seguidor`;

-- DropIndex
DROP INDEX `Seguidor_seguidor_id_seguido_id_key` ON `seguidor`;

-- AlterTable
ALTER TABLE `seguidor` DROP COLUMN `seguido_id`,
    DROP COLUMN `seguidor_id`,
    ADD COLUMN `seguido_uid` VARCHAR(191) NOT NULL,
    ADD COLUMN `seguidor_uid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Seguidor_seguidor_uid_seguido_uid_key` ON `Seguidor`(`seguidor_uid`, `seguido_uid`);

-- AddForeignKey
ALTER TABLE `Seguidor` ADD CONSTRAINT `Seguidor_seguidor_uid_fkey` FOREIGN KEY (`seguidor_uid`) REFERENCES `Usuario`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Seguidor` ADD CONSTRAINT `Seguidor_seguido_uid_fkey` FOREIGN KEY (`seguido_uid`) REFERENCES `Usuario`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
