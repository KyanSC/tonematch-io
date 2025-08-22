/*
  Warnings:

  - The values [single_coil,humbucker,p90,other] on the enum `PickupType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ampFamily` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `ampType` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `buttons` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `channelsArray` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `channelsList` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `controls` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `controlsList` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `isTube` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `knobs` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `otherFeatures` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `powerSection` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `voicings` on the `Amp` table. All the data in the column will be lost.
  - You are about to drop the column `controls` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `layoutCode` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `layoutPreset` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `otherControls` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `pickupSwitchOptions` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `pickupType` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `pickupTypeEnum` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `pickups` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `selector` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `switchPositions` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `toneControls` on the `Guitar` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `baseAmpId` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `baseGuitarId` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `baseSettings` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `referencePickupPosition` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `referencePickupVoice` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `songSection` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `sourceLinks` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `verificationNotes` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Tone` table. All the data in the column will be lost.
  - You are about to drop the `GearMatch` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[title,artist]` on the table `Song` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[songId,slug]` on the table `Tone` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Amp` table without a default value. This is not possible if the table is not empty.
  - Made the column `hasReverb` on table `Amp` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Guitar` table without a default value. This is not possible if the table is not empty.
  - Made the column `pickupLayout` on table `Guitar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toneKnobs` on table `Guitar` required. This step will fail if there are existing NULL values in that column.
  - Made the column `volumeKnobs` on table `Guitar` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `intent` to the `Tone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Tone` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tone` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ToneRole" AS ENUM ('CLEAN', 'RHYTHM', 'CRUNCH', 'LEAD', 'SOLO');

-- CreateEnum
CREATE TYPE "public"."Instrument" AS ENUM ('GUITAR', 'BASS');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PickupType_new" AS ENUM ('SINGLE_COIL', 'HUMBUCKER', 'P90', 'OTHER');
ALTER TABLE "public"."Tone" ALTER COLUMN "sourcePickupType" TYPE "public"."PickupType_new" USING ("sourcePickupType"::text::"public"."PickupType_new");
ALTER TYPE "public"."PickupType" RENAME TO "PickupType_old";
ALTER TYPE "public"."PickupType_new" RENAME TO "PickupType";
DROP TYPE "public"."PickupType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."GearMatch" DROP CONSTRAINT "GearMatch_ampId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GearMatch" DROP CONSTRAINT "GearMatch_guitarId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GearMatch" DROP CONSTRAINT "GearMatch_toneId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tone" DROP CONSTRAINT "Tone_baseAmpId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tone" DROP CONSTRAINT "Tone_baseGuitarId_fkey";

-- AlterTable
ALTER TABLE "public"."Amp" DROP COLUMN "ampFamily",
DROP COLUMN "ampType",
DROP COLUMN "buttons",
DROP COLUMN "channelsArray",
DROP COLUMN "channelsList",
DROP COLUMN "controls",
DROP COLUMN "controlsList",
DROP COLUMN "isTube",
DROP COLUMN "knobs",
DROP COLUMN "otherFeatures",
DROP COLUMN "powerSection",
DROP COLUMN "voicings",
ADD COLUMN     "controlsExtra" JSONB,
ADD COLUMN     "hasBass" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasBoost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasBright" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasContour" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDepth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasDriveChannel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasFXLoopLevel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasGraphicEQ" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasMasterVolume" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasMid" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasNoiseGate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPowerScale" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPreampGain" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasPresence" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasResonance" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasToneCut" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasTreble" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "hasVolume" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "hasReverb" SET NOT NULL,
ALTER COLUMN "hasReverb" SET DEFAULT false,
ALTER COLUMN "channels" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Guitar" DROP COLUMN "controls",
DROP COLUMN "layoutCode",
DROP COLUMN "layoutPreset",
DROP COLUMN "otherControls",
DROP COLUMN "pickupSwitchOptions",
DROP COLUMN "pickupType",
DROP COLUMN "pickupTypeEnum",
DROP COLUMN "pickups",
DROP COLUMN "selector",
DROP COLUMN "switchPositions",
DROP COLUMN "toneControls",
ADD COLUMN     "hasCoilSplitBridge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasCoilSplitNeck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "knobMapping" JSONB,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "positions" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "pickupLayout" SET NOT NULL,
ALTER COLUMN "pickupLayout" SET DATA TYPE TEXT,
ALTER COLUMN "toneKnobs" SET NOT NULL,
ALTER COLUMN "volumeKnobs" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Song" DROP COLUMN "genre",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tone" DROP COLUMN "baseAmpId",
DROP COLUMN "baseGuitarId",
DROP COLUMN "baseSettings",
DROP COLUMN "confidence",
DROP COLUMN "description",
DROP COLUMN "difficulty",
DROP COLUMN "referencePickupPosition",
DROP COLUMN "referencePickupVoice",
DROP COLUMN "songSection",
DROP COLUMN "sourceLinks",
DROP COLUMN "verificationNotes",
DROP COLUMN "verified",
ADD COLUMN     "guitarist" TEXT,
ADD COLUMN     "instrument" "public"."Instrument",
ADD COLUMN     "intent" JSONB NOT NULL,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "role" "public"."ToneRole",
ADD COLUMN     "section" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "sourceAmp" TEXT,
ADD COLUMN     "sourceAmpChannel" TEXT,
ADD COLUMN     "sourceGuitar" TEXT,
ADD COLUMN     "sourceNotes" TEXT,
ADD COLUMN     "sourcePedals" TEXT,
ADD COLUMN     "sourcePickup" TEXT,
ADD COLUMN     "sourcePickupType" "public"."PickupType",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "public"."GearMatch";

-- DropEnum
DROP TYPE "public"."AmpFamily";

-- DropEnum
DROP TYPE "public"."LayoutPreset";

-- DropEnum
DROP TYPE "public"."SongSection";

-- CreateIndex
CREATE UNIQUE INDEX "Song_title_artist_key" ON "public"."Song"("title", "artist");

-- CreateIndex
CREATE UNIQUE INDEX "Tone_songId_slug_key" ON "public"."Tone"("songId", "slug");
