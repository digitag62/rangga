"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { LedgerProps } from "@/lib/types";
import { LedgerForm } from "@/components/ledger/form";
import { columns as getColumns } from "@/components/ledger/columns";

export const LedgerTableClient = ({ data }: { data: LedgerProps[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState<LedgerProps | null>(null);

  const columns = getColumns({ setIsOpen, setSelectedLedger });

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchBy="amount"
        url="/ledger"
        createForm={
          <Button
            variant="outline"
            className="text-foreground w-fit px-0 text-left"
            onClick={() => {
              setSelectedLedger(null);
              setIsOpen(true);
            }}
          >
            <PlusCircle />
            New
          </Button>
        }
      />

      <LedgerForm data={selectedLedger} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
