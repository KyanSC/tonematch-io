-- CreateTable
CREATE TABLE "public"."Guitar" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "pickupType" TEXT NOT NULL,
    "toneControls" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Guitar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amp" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "ampType" TEXT NOT NULL,
    "hasReverb" BOOLEAN NOT NULL,
    "channels" INTEGER NOT NULL,
    "controls" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Song" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "genre" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tone" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL,
    "baseSettings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GearMatch" (
    "id" TEXT NOT NULL,
    "toneId" TEXT NOT NULL,
    "guitarId" TEXT,
    "ampId" TEXT,
    "settings" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GearMatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Tone" ADD CONSTRAINT "Tone_songId_fkey" FOREIGN KEY ("songId") REFERENCES "public"."Song"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GearMatch" ADD CONSTRAINT "GearMatch_toneId_fkey" FOREIGN KEY ("toneId") REFERENCES "public"."Tone"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GearMatch" ADD CONSTRAINT "GearMatch_guitarId_fkey" FOREIGN KEY ("guitarId") REFERENCES "public"."Guitar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GearMatch" ADD CONSTRAINT "GearMatch_ampId_fkey" FOREIGN KEY ("ampId") REFERENCES "public"."Amp"("id") ON DELETE SET NULL ON UPDATE CASCADE;
