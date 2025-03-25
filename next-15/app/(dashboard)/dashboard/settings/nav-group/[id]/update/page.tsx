import React from "react";
import prismadb from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NavGroupForm } from "@/components/navgroup-form";

const UpdateNavGroup = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const item = await prismadb.navGroup.findUnique({
    where: { id: id },
    select: {
      id: true,
      title: true,
      url: true,
      icon: true,
    },
  });
  if (!item) notFound();

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Update Role</h1>
        <NavGroupForm navGroup={item} />
      </div>
    </div>
  );
};

export default UpdateNavGroup;
