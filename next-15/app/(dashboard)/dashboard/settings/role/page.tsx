import React from "react";
import prismadb from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

const RolePage = async () => {
  const data = await prismadb.role.findMany();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 w-full gap-2">
        <h1 className="text-xl">Role Settings</h1>
        <DataTable
          columns={columns}
          data={data}
          searchBy="role"
          url="/dashboard/settings/role/create"
        />
      </div>
    </div>
  );
};

export default RolePage;
