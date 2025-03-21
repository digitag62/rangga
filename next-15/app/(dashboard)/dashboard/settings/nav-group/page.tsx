import React from "react";
import prismadb from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

const NavGroupPage = async () => {
  const data = await prismadb.navGroup.findMany({
    select: {
      id: true,
      title: true,
      url: true,
      icon: true,
    },
  });

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 w-full gap-2">
        <h1 className="text-xl">NavGroup Settings</h1>
        <DataTable
          columns={columns}
          data={data}
          searchBy="title"
          url="/dashboard/settings/nav-group/create"
        />
      </div>
    </div>
  );
};

export default NavGroupPage;
