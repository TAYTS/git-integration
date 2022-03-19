/*
  Warnings:

  - A unique constraint covering the columns `[userID,accountID,provider]` on the table `GitAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountID` to the `GitAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GitAccount` ADD COLUMN `accountID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `GitAccount_userID_accountID_provider_key` ON `GitAccount`(`userID`, `accountID`, `provider`);
