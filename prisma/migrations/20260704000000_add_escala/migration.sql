-- CreateEnum
CREATE TYPE "PosicaoEscala" AS ENUM ('ESTACIONAMENTO', 'PORTA_PRINCIPAL', 'PORTA_LATERAL', 'DATASHOW', 'TRANSMISSAO', 'CANTINA', 'MIDIAS_CAMERA', 'MIDIAS_STORIES');

-- CreateTable
CREATE TABLE "Escala" (
    "id" TEXT NOT NULL,
    "mes" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,
    "criadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Escala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalaDomingo" (
    "id" TEXT NOT NULL,
    "escalaId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscalaDomingo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalaVaga" (
    "id" TEXT NOT NULL,
    "domingoId" TEXT NOT NULL,
    "posicao" "PosicaoEscala" NOT NULL,
    "slot" INTEGER NOT NULL DEFAULT 1,
    "usuarioId" TEXT,
    "ministerioId" TEXT,
    "grupoCaseiro" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EscalaVaga_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Escala_mes_ano_key" ON "Escala"("mes", "ano");

-- CreateIndex
CREATE UNIQUE INDEX "EscalaVaga_domingoId_posicao_slot_key" ON "EscalaVaga"("domingoId", "posicao", "slot");

-- AddForeignKey
ALTER TABLE "Escala" ADD CONSTRAINT "Escala_criadorId_fkey" FOREIGN KEY ("criadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaDomingo" ADD CONSTRAINT "EscalaDomingo_escalaId_fkey" FOREIGN KEY ("escalaId") REFERENCES "Escala"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaVaga" ADD CONSTRAINT "EscalaVaga_domingoId_fkey" FOREIGN KEY ("domingoId") REFERENCES "EscalaDomingo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaVaga" ADD CONSTRAINT "EscalaVaga_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscalaVaga" ADD CONSTRAINT "EscalaVaga_ministerioId_fkey" FOREIGN KEY ("ministerioId") REFERENCES "Ministerio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
