-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "expires_at" SET DEFAULT now() + interval '7 days';
