import React from "react";
import { RoleForm } from "@/components/role-form";

const CreateRole = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center w-full gap-2">
        <h1 className="text-lg">Create Role</h1>
        <RoleForm />
      </div>
    </div>
  );
};

export default CreateRole;
