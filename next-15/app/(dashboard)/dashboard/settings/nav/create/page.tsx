import React from "react";
import { NavForm } from "@/components/nav-form";

const NavCreate = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col justify-center items-center w-full gap-2">
        <h1 className="text-lg">Create NavLink</h1>
        <NavForm />
      </div>
    </div>
  );
};

export default NavCreate;
