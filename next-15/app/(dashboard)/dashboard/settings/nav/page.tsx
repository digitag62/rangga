import React from "react";
import prismadb from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

const NavPage = async () => {
  const data = await prismadb.nav.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      navGroupId: true,
      access: true,
      NavGroup: {
        select: {
          title: true,
          url: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 w-full gap-2">
        <h1 className="text-xl">Nav Settings</h1>
        <DataTable
          columns={columns}
          data={data}
          searchBy="title"
          url="/dashboard/settings/nav/create"
        />
      </div>
    </div>
  );
};

export default NavPage;
