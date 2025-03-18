import React from "react";
import Link from "next/link";

const RolePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl">Role settings</h1>
        <Link href="/dashboard/settings/role/create">Create Role</Link>
      </div>
    </div>
  );
};

export default RolePage;
