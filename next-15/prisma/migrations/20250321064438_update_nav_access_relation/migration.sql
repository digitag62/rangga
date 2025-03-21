/*
  Warnings:

  - You are about to drop the column `navGroupId` on the `Access` table. All the data in the column will be lost.
  - Added the required column `navId` to the `Access` table without a default value. This is not possible if the table is not empty.
  - Made the column `roleId` on table `Access` required. This step will fail if there are existing NULL values in that column.
  - Made the column `navGroupId` on table `Nav` required. This step will fail if there are existing NULL values in that column.
  - Made the column `roleId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_navGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_roleId_fkey";

-- DropForeignKey
ALTER TABLE "Nav" DROP CONSTRAINT "Nav_navGroupId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- AlterTable
ALTER TABLE "Access" DROP COLUMN "navGroupId",
ADD COLUMN     "navId" TEXT NOT NULL,
ALTER COLUMN "roleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Nav" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "navGroupId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "roleId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Access" ADD CONSTRAINT "Access_navId_fkey" FOREIGN KEY ("navId") REFERENCES "Nav"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nav" ADD CONSTRAINT "Nav_navGroupId_fkey" FOREIGN KEY ("navGroupId") REFERENCES "NavGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
