import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { CatTableClient } from "@/components/cat/cat-table";

const CatPage = async () => {
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
  const data = await prismadb.cat.findMany({
    select: {
      id: true,
      cat: true,
      max: true,
      bookId: true,
      userId: true,
      isActive: true,
    },
    // where: { NOT: { role: "ADMIN" } }, // example filter if needed
  });

  return <CatTableClient data={data} />;
};

export default CatPage;
