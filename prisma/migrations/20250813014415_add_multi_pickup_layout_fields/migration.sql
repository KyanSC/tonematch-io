-- CreateEnum
CREATE TYPE "public"."PickupType" AS ENUM ('single_coil', 'humbucker', 'p90', 'other');

-- CreateEnum
CREATE TYPE "public"."LayoutPreset" AS ENUM ('SSS_5WAY', 'HSS_5WAY', 'HSH_5WAY', 'HH_3WAY', 'HH_5WAY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."AmpFamily" AS ENUM ('fender', 'marshall', 'vox', 'modeling', 'solid_state', 'other');

-- AlterTable
ALTER TABLE "public"."Amp" ADD COLUMN     "ampFamily" "public"."AmpFamily",
ADD COLUMN     "channelsArray" JSONB,
ADD COLUMN     "isTube" BOOLEAN,
ADD COLUMN     "knobs" JSONB,
ADD COLUMN     "otherFeatures" JSONB,
ALTER COLUMN "ampType" DROP NOT NULL,
ALTER COLUMN "hasReverb" DROP NOT NULL,
ALTER COLUMN "channels" DROP NOT NULL,
ALTER COLUMN "controls" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Guitar" ADD COLUMN     "controls" JSONB,
ADD COLUMN     "layoutPreset" "public"."LayoutPreset",
ADD COLUMN     "otherControls" JSONB,
ADD COLUMN     "pickupLayout" JSONB,
ADD COLUMN     "pickupSwitchOptions" JSONB,
ADD COLUMN     "pickupTypeEnum" "public"."PickupType",
ADD COLUMN     "switchPositions" JSONB,
ADD COLUMN     "toneKnobs" INTEGER,
ADD COLUMN     "volumeKnobs" INTEGER,
ALTER COLUMN "pickupType" DROP NOT NULL,
ALTER COLUMN "toneControls" DROP NOT NULL;
