import React from "react";
import { NavGroupForm } from "@/components/navgroup-form";

const CreateNavGroup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center w-full gap-2">
        <h1 className="text-lg">Create NavGroup</h1>
        <NavGroupForm />
      </div>
    </div>
  );
};

export default CreateNavGroup;
