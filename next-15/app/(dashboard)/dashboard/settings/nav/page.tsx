import React from "react";
import Link from "next/link";

import prismadb from "@/lib/prisma";
import { DataTable } from "@/components/ui/datatable";
import { columnsNavGroup } from "./columns-navgroup";
import { columnsNavLink } from "./columns-navlink";

const SettingsPage = async () => {
  const dataNavGroup = await prismadb.navGroup.findMany();
  const dataNavLink = await prismadb.nav.findMany();

  return (
    <div className="min-h-screen flex-col items-center">
      <div className="p-12 w-full space-y-2">
        <h1 className="text-xl">NavGroup settings</h1>
        <DataTable
          columns={columnsNavGroup}
          data={dataNavGroup}
          searchBy="title"
          url="/dashboard/settings/nav/create-group"
        />
      </div>
      <div className="p-12 w-full space-y-2">
        <h1 className="text-xl">NavLink settings</h1>
        <DataTable
          columns={columnsNavLink}
          data={dataNavLink}
          searchBy="title"
          url="/dashboard/settings/nav/create"
        />
      </div>
    </div>
  );
};

export default SettingsPage;
