"use client";

import { CatProps } from "@/lib/cat/types";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { cn } from "@/lib/utils";
import { DeleteDialogCat } from "@/components/cat/cat-delete-dialog";

export const columns = ({ setIsOpen, setSelectedCat }: { setIsOpen: (val: boolean) => void; setSelectedCat: (Cat: CatProps | null) => void }): ColumnDef<CatProps>[] => [
	{
		accessorKey: "cat",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.cat}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Cat" />,
	},
	{
		accessorKey: "type",
		// cell: ({ row }) => <p className="text-left ml-3">{row.original.type}</p>,
		cell: ({ row }) => {
			const data = row.original;
			let color = "text-muted-foreground";

			switch (data.type) {
				case "EXP":
					color = "text-red-600";
					break;
				case "ERN":
					color = "text-emerald-600";
					break;
				case "SAV":
					color = "text-sky-600";
					break;
				case "TRF":
					color = "text-yellow-600";
					break;
				default:
					break;
			}

			return (
				<div className="w-32">
					<Badge variant="outline" className={cn(color, "px-1.5 text-left ml-3")}>
						{data.type}
					</Badge>
				</div>
			);
		},
		header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
	},
	{
		accessorKey: "max",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.max}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="Max" />,
	},
	{
		accessorKey: "bookName",
		cell: ({ row }) => <p className="text-left ml-3">{row.original.book?.name}</p>,
		header: ({ column }) => <DataTableColumnHeader column={column} title="BookId" />,
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
		cell: ({ row }) => <DeleteDialogCat data={row.original} setIsOpen={setIsOpen} setSelectedCat={setSelectedCat} />,
	},
];
