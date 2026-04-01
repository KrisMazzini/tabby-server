-- DropForeignKey
ALTER TABLE "magic_tokens" DROP CONSTRAINT "magic_tokens_user_id_fkey";

-- AddForeignKey
ALTER TABLE "magic_tokens" ADD CONSTRAINT "magic_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
