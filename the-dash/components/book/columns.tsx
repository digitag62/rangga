"use client";

import { BookProps } from "@/lib/book/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { cn } from "@/lib/utils";
import { DeleteDialogBook } from "@/components/book/book-delete-dialog";

export const columns = ({ setIsOpen, setSelectedBook }: { setIsOpen: (val: boolean) => void; setSelectedBook: (Book: BookProps | null) => void }): ColumnDef<BookProps>[] => [
	{
		accessorKey: "name",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.name}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
	},
	{
		accessorKey: "summary",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.summary}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Summary" />,
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
		cell: ({ row }) => <DeleteDialogBook data={row.original} setIsOpen={setIsOpen} setSelectedBook={setSelectedBook} />,
	},
];
