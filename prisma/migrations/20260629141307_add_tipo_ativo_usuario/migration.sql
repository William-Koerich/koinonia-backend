-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'MEMBRO',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "dataAniversario" DATETIME,
    "genero" TEXT,
    "estadoCivil" TEXT,
    "logradouro" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("bairro", "cidade", "createdAt", "dataAniversario", "email", "estadoCivil", "foto", "genero", "id", "logradouro", "nome", "senhaHash", "sobrenome", "updatedAt") SELECT "bairro", "cidade", "createdAt", "dataAniversario", "email", "estadoCivil", "foto", "genero", "id", "logradouro", "nome", "senhaHash", "sobrenome", "updatedAt" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
