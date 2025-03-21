import React from "react";
import { NavForm } from "@/components/nav-form";
import prismadb from "@/lib/prisma";

const CreateRole = async () => {
  const navGroup = await prismadb.navGroup.findMany({
    select: { id: true, title: true, url: true },
  });
  const role = await prismadb.role.findMany({ select: { role: true } });

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Create Nav</h1>
        <NavForm navGroup={navGroup} role={role} />
      </div>
    </div>
  );
};

export default CreateRole;
