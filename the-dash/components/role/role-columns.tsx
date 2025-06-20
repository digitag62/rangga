"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { cn } from "@/lib/utils";
import { RoleProps } from "@/lib/role/types";
import { DeleteDialogRole } from "@/components/role/role-delete-dialog";

export const columns = ({ setIsOpen, setSelectedRole }: { setIsOpen: (val: boolean) => void; setSelectedRole: (role: RoleProps | null) => void }): ColumnDef<RoleProps>[] => [
	{
		accessorKey: "role",
		cell: ({ row }) => {
			const data = row.original;
			return <p className="text-left ml-3">{data.role}</p>;
		},
		header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
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
		header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => <DeleteDialogRole data={row.original} setIsOpen={setIsOpen} setSelectedRole={setSelectedRole} />,
	},
];
