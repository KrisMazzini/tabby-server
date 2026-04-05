-- CreateEnum
CREATE TYPE "ExpenseSplitKind" AS ENUM ('equally', 'byPercentage', 'byShares', 'byFixedAmounts');

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "payer_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currency_iso" TEXT NOT NULL,
    "total_amount_in_cents" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "group_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "split_kind" "ExpenseSplitKind" NOT NULL,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expense_slices" (
    "expense_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_in_cents" INTEGER,
    "percentage" INTEGER,
    "shares" INTEGER,

    CONSTRAINT "expense_slices_pkey" PRIMARY KEY ("expense_id","user_id")
);

-- CreateIndex
CREATE INDEX "expenses_payer_id_idx" ON "expenses"("payer_id");

-- CreateIndex
CREATE INDEX "expenses_group_id_idx" ON "expenses"("group_id");

-- CreateIndex
CREATE INDEX "expense_slices_expense_id_idx" ON "expense_slices"("expense_id");

-- CreateIndex
CREATE INDEX "expense_slices_user_id_idx" ON "expense_slices"("user_id");

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_payer_id_fkey" FOREIGN KEY ("payer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_slices" ADD CONSTRAINT "expense_slices_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense_slices" ADD CONSTRAINT "expense_slices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
