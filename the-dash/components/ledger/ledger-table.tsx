"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { LedgerProps } from "@/lib/ledger/types";
import { LedgerForm } from "@/components/ledger/form";
import { columns as getColumns } from "@/components/ledger/columns";
import { BookProps } from "@/lib/book/types";
import { CatProps } from "@/lib/cat/types";

export const LedgerTableClient = ({ data, books, cats }: { data: LedgerProps[], books: BookProps[], cats:CatProps[] }) => {
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

      <LedgerForm data={selectedLedger} books={books} cats={cats} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
