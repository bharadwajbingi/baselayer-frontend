-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "config_hash" TEXT NOT NULL,
    "stack" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "features" JSONB,
    "zip_url" TEXT NOT NULL,
    "pdf_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '7 days',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserProject" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_config_hash_key" ON "public"."Project"("config_hash");

-- CreateIndex
CREATE INDEX "UserProject_user_id_idx" ON "public"."UserProject"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProject_user_id_project_id_key" ON "public"."UserProject"("user_id", "project_id");

-- AddForeignKey
ALTER TABLE "public"."UserProject" ADD CONSTRAINT "UserProject_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
