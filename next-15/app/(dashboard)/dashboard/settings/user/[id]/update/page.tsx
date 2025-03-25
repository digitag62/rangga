import React from "react";
import prismadb from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserForm } from "@/components/user-form";

const UpdateUser = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const item = await prismadb.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      roleId: true,
    },
  });
  if (!item) notFound();
  const role = await prismadb.role.findMany({
    select: { id: true, role: true },
  });

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Update Role</h1>
        <UserForm user={item} role={role} />
      </div>
    </div>
  );
};

export default UpdateUser;
