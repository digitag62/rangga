import React from "react";
import { NavGroupForm } from "@/components/navgroup-form";

const CreateRole = () => {
  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Create Role</h1>
        <NavGroupForm />
      </div>
    </div>
  );
};

export default CreateRole;
