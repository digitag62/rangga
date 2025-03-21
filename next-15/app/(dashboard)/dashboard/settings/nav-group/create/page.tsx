import React from "react";
import { NavGroupForm } from "@/components/navgroup-form";

interface Props {
  searchParams: { [key: string]: string };
}

const CreateRole = async ({ searchParams }: Props) => {
  const searchPar = await searchParams;
  const referal = Object.keys(searchPar).length ? searchPar.ref : null;
  const navId = Object.keys(searchPar).length ? searchPar.id : null;

  return (
    <div className="min-h-screen flex justify-center">
      <div className="p-12 space-y-6 md:w-1/2 w-full gap-2">
        <h1 className="text-lg">Create NavGroup</h1>
        <NavGroupForm referal={referal} navId={navId} />
      </div>
    </div>
  );
};

export default CreateRole;
