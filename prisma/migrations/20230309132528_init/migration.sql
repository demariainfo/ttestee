-- CreateEnum
CREATE TYPE "UsuarioTipoEnum" AS ENUM ('ADMIN', 'USUARIO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "tipo" "UsuarioTipoEnum" NOT NULL DEFAULT 'USUARIO',
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailConfirmadoEm" TIMESTAMP(3),
    "tokenConfirmacaoEmail" TEXT,
    "senha" TEXT NOT NULL,
    "ultimaAlteracaoSenha" TIMESTAMP(3),
    "tokenRecuperacaoSenha" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_empresas" (
    "empresaId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "isResponsavel" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "usuario_empresas_pkey" PRIMARY KEY ("empresaId","usuarioId")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE INDEX "usuario_empresas_empresaId_idx" ON "usuario_empresas"("empresaId");

-- CreateIndex
CREATE INDEX "usuario_empresas_usuarioId_idx" ON "usuario_empresas"("usuarioId");

-- AddForeignKey
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_empresas" ADD CONSTRAINT "usuario_empresas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
