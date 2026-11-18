-- CreateTable
CREATE TABLE "Deck" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "doc" JSONB NOT NULL,
    "createdById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deck_isTemplate_updatedAt_idx" ON "Deck"("isTemplate", "updatedAt");

-- AddForeignKey
ALTER TABLE "Deck" ADD CONSTRAINT "Deck_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
