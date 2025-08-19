-- CreateEnum
CREATE TYPE "public"."SongSection" AS ENUM ('INTRO', 'VERSE', 'CHORUS', 'BRIDGE', 'SOLO', 'OUTRO', 'BREAKDOWN');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."AmpFamily" ADD VALUE 'boss';
ALTER TYPE "public"."AmpFamily" ADD VALUE 'blackstar';
ALTER TYPE "public"."AmpFamily" ADD VALUE 'orange';
ALTER TYPE "public"."AmpFamily" ADD VALUE 'peavey';
ALTER TYPE "public"."AmpFamily" ADD VALUE 'line6';

-- AlterTable
ALTER TABLE "public"."Amp" ADD COLUMN     "buttons" JSONB,
ADD COLUMN     "channelsList" JSONB,
ADD COLUMN     "controlsList" JSONB,
ADD COLUMN     "powerSection" JSONB,
ADD COLUMN     "voicings" JSONB;

-- AlterTable
ALTER TABLE "public"."Guitar" ADD COLUMN     "layoutCode" TEXT,
ADD COLUMN     "pickups" JSONB,
ADD COLUMN     "selector" JSONB;

-- AlterTable
ALTER TABLE "public"."Tone" ADD COLUMN     "baseAmpId" TEXT,
ADD COLUMN     "baseGuitarId" TEXT,
ADD COLUMN     "confidence" INTEGER NOT NULL DEFAULT 70,
ADD COLUMN     "referencePickupPosition" TEXT,
ADD COLUMN     "referencePickupVoice" JSONB,
ADD COLUMN     "songSection" "public"."SongSection",
ADD COLUMN     "sourceLinks" JSONB,
ADD COLUMN     "verificationNotes" TEXT,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "public"."Tone" ADD CONSTRAINT "Tone_baseGuitarId_fkey" FOREIGN KEY ("baseGuitarId") REFERENCES "public"."Guitar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tone" ADD CONSTRAINT "Tone_baseAmpId_fkey" FOREIGN KEY ("baseAmpId") REFERENCES "public"."Amp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
