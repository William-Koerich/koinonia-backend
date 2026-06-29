/*
  Warnings:

  - You are about to drop the column `coLiderId` on the `Ministerio` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MinisterioCoLider" (
    "ministerioId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    PRIMARY KEY ("ministerioId", "usuarioId"),
    CONSTRAINT "MinisterioCoLider_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MinisterioCoLider_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ministerio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "liderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ministerio_liderId_fkey" FOREIGN KEY ("liderId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ministerio" ("createdAt", "descricao", "id", "liderId", "nome", "updatedAt") SELECT "createdAt", "descricao", "id", "liderId", "nome", "updatedAt" FROM "Ministerio";
DROP TABLE "Ministerio";
ALTER TABLE "new_Ministerio" RENAME TO "Ministerio";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
