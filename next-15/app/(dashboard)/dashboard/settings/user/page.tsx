import React from "react";
import prismadb from "@/lib/prisma";

import { columns } from "./columns";
import { DataTable } from "@/components/ui/datatable";

const UserPage = async () => {
  const data = await prismadb.user.findMany({
    select: {
      id: true,
      email: true,
      role: {
        select: {
          id: true,
          role: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 w-full gap-2">
        <h1 className="text-xl">User Settings</h1>
        <DataTable columns={columns} data={data} searchBy="email" />
      </div>
    </div>
  );
};

export default UserPage;
