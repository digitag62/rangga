/*
  Warnings:

  - You are about to drop the `Access` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_navId_fkey";

-- DropForeignKey
ALTER TABLE "Access" DROP CONSTRAINT "Access_roleId_fkey";

-- AlterTable
ALTER TABLE "Nav" ADD COLUMN     "access" TEXT[] DEFAULT ARRAY['USER', 'ADMIN']::TEXT[];

-- DropTable
DROP TABLE "Access";
