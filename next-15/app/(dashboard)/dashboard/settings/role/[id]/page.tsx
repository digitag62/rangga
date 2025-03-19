import React from "react";
import { notFound } from "next/navigation";

import prismadb from "@/lib/prisma";
import { formatDate } from "@/lib/helpers";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const RoleDetails = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const item = await prismadb.role.findUnique({ where: { id: id } });
  if (!item) notFound();

  return (
    <div className="pt-12 flex justify-center">
      <div className="p-12 space-y-6 border rounded-md">
        <h1 className="t">Role Details</h1>
        <p className="text-xl font-bold">{item.role}</p>
        <div className="flex flex-col text-muted-foreground">
          <p>created at {formatDate(item.createdAt)}</p>
          <p>created by {item.createdBy.split("@")[0]}</p>
          <p>updated at {formatDate(item.createdAt)}</p>
          <p>updated by {item.updatedBy?.split("@")[0] || "null"}</p>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/dashboard/settings/role`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Back
          </Link>
          <Link
            href={`/dashboard/settings/role/${id}/update`}
            className={cn(buttonVariants(), "w-full")}
          >
            Update
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;
