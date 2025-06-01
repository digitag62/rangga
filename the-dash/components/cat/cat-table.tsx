"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { CatProps } from "@/lib/types";
import { CatForm } from "@/components/cat/form";
import { columns as getColumns } from "@/components/cat/columns";

export const CatTableClient = ({ data }: { data: CatProps[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<CatProps | null>(null);

  const columns = getColumns({ setIsOpen, setSelectedCat });

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchBy="cat"
        url="/cat"
        createForm={
          <Button
            variant="outline"
            className="text-foreground w-fit px-0 text-left"
            onClick={() => {
              setSelectedCat(null);
              setIsOpen(true);
            }}
          >
            <PlusCircle />
            New
          </Button>
        }
      />

      <CatForm data={selectedCat} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
