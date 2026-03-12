-- CreateEnum
CREATE TYPE "TipoAtendimento" AS ENUM ('PLANO', 'PARTICULAR');

-- CreateEnum
CREATE TYPE "StatusAgenda" AS ENUM ('AGENDADO', 'COMPARECEU', 'FALTOU', 'CANCELADO');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVO', 'INATIVO', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "reset_password_token" TEXT,
    "reset_password_expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planos_saude" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "valor_consulta" DECIMAL(10,2) NOT NULL,
    "data_pagamento" TIMESTAMP(3) NOT NULL,
    "percentual_desconto" DECIMAL(5,2),
    "valor_liquido" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "planos_saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacientes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "tipo_atendimento" "TipoAtendimento" NOT NULL,
    "plano_saude_id" INTEGER,
    "valor_particular" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "paciente_id" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "status" "StatusAgenda" NOT NULL DEFAULT 'AGENDADO',
    "valor_consulta" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "status" "StatusAssinatura" NOT NULL DEFAULT 'ATIVO',
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_expiracao" TIMESTAMP(3) NOT NULL,
    "plano" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "planos_saude_usuario_id_idx" ON "planos_saude"("usuario_id");

-- CreateIndex
CREATE INDEX "pacientes_usuario_id_idx" ON "pacientes"("usuario_id");

-- CreateIndex
CREATE INDEX "pacientes_plano_saude_id_idx" ON "pacientes"("plano_saude_id");

-- CreateIndex
CREATE INDEX "agendas_usuario_id_data_idx" ON "agendas"("usuario_id", "data");

-- CreateIndex
CREATE INDEX "agendas_paciente_id_idx" ON "agendas"("paciente_id");

-- CreateIndex
CREATE INDEX "assinaturas_usuario_id_status_idx" ON "assinaturas"("usuario_id", "status");

-- AddForeignKey
ALTER TABLE "planos_saude" ADD CONSTRAINT "planos_saude_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_plano_saude_id_fkey" FOREIGN KEY ("plano_saude_id") REFERENCES "planos_saude"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendas" ADD CONSTRAINT "agendas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assinaturas" ADD CONSTRAINT "assinaturas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

