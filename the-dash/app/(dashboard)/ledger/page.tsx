import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { LedgerTableClient } from "@/components/ledger/ledger-table";

const LedgerPage = async () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
      </div>
    </div>
  );
};

const Content = async () => {
  const data = await prismadb.ledger.findMany({
    select: {
      id: true,
      amount: true,
      remarks: true,
      catId: true,
      bookId: true,
      userId: true,
      isActive: true,
    },
    // where: { NOT: { role: "ADMIN" } }, // example filter if needed
  });

  return <LedgerTableClient data={data} />;
};

export default LedgerPage;
