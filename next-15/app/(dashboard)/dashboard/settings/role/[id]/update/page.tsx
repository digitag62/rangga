import React from "react";
import prismadb from "@/lib/prisma";
import { notFound } from "next/navigation";
// import { RoleUpdate } from "@/components/role-update";
import { RoleForm } from "@/components/role-form";

const UpdateRole = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const item = await prismadb.role.findUnique({
    where: { id: id },
    select: {
      id: true,
      role: true,
    },
  });
  if (!item) notFound();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Update Role</h1>
        <RoleForm role={item} />
        {/* <RoleUpdate role={item} /> */}
      </div>
    </div>
  );
};

export default UpdateRole;
