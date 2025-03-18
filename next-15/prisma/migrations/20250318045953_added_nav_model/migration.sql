-- CreateTable
CREATE TABLE "Nav" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "adminOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "Nav_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nav_title_key" ON "Nav"("title");
