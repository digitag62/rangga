"use client";

import { LedgerProps } from "@/lib/ledger/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { cn } from "@/lib/utils";
import { DeleteDialogLedger } from "@/components/ledger/ledger-delete-dialog";

export const columns = ({ setIsOpen, setSelectedLedger }: { setIsOpen: (val: boolean) => void; setSelectedLedger: (Ledger: LedgerProps | null) => void }): ColumnDef<LedgerProps>[] => [
	{
		accessorKey: "amount",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.amount}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
	},
	{
		accessorKey: "remarks",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.remarks}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
	},
	{
		accessorKey: "type",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.type}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
	},
	{
		accessorKey: "cat",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.cat.cat}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Cat" />,
	},
	{
		accessorKey: "book",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.book.name}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Book" />,
	},
	{
		accessorKey: "isActive",
		cell: ({ row }) => {
			const data = row.original;
			return (
				<div className="w-32">
					<Badge variant="outline" className={cn(data.isActive ? "text-emerald-600" : "text-red-600", "px-1.5 text-left ml-3")}>
						{data.isActive ? "Active" : "Inactive"}
					</Badge>
				</div>
			);
		},
		header: ({ column }) => <DataTableColumnHeader column={column} title="IsActive" />,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <DeleteDialogLedger data={row.original} setIsOpen={setIsOpen} setSelectedLedger={setSelectedLedger} />,
	},
];
