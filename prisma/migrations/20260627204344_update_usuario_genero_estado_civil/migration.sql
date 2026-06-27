/*
  Warnings:

  - Added the required column `estadoCivil` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "dataAniversario" DATETIME NOT NULL,
    "genero" TEXT NOT NULL,
    "estadoCivil" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("bairro", "cidade", "createdAt", "dataAniversario", "foto", "genero", "id", "logradouro", "nome", "sobrenome", "updatedAt") SELECT "bairro", "cidade", "createdAt", "dataAniversario", "foto", "genero", "id", "logradouro", "nome", "sobrenome", "updatedAt" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
