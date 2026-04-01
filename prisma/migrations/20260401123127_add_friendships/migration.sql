-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('pending', 'accepted', 'blocked');

-- CreateTable
CREATE TABLE "friendships" (
    "id" TEXT NOT NULL,
    "from_user_id" TEXT NOT NULL,
    "to_user_id" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "friendships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "friendships_from_user_id_idx" ON "friendships"("from_user_id");

-- CreateIndex
CREATE INDEX "friendships_to_user_id_idx" ON "friendships"("to_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "friendships_from_user_id_to_user_id_key" ON "friendships"("from_user_id", "to_user_id");

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
