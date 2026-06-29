-- CreateTable
CREATE TABLE "Ministerio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "liderId" TEXT,
    "coLiderId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ministerio_liderId_fkey" FOREIGN KEY ("liderId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ministerio_coLiderId_fkey" FOREIGN KEY ("coLiderId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Evento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "foto" TEXT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "dataHora" DATETIME NOT NULL,
    "localizacao" TEXT,
    "valor" REAL NOT NULL DEFAULT 0,
    "ministerioId" TEXT,
    "criadorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Evento_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Evento_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inscricao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "usuarioId" TEXT NOT NULL,
    "eventoId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "pagoEm" DATETIME,
    "comprovante" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inscricao_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inscricao_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "Evento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Inscricao_usuarioId_eventoId_key" ON "Inscricao"("usuarioId", "eventoId");
