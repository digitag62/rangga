"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { cn } from "@/lib/utils";
import { UserWithRoleProps } from "@/lib/user/types";
import { DeleteDialogUser } from "@/components/user/user-delete-dialog";

export const userColumns = ({ setIsOpen, setSelected }: { setIsOpen: (val: boolean) => void; setSelected: (role: UserWithRoleProps | null) => void }): ColumnDef<UserWithRoleProps>[] => [
	{
		accessorKey: "email",
		cell: ({ row }) => {
			const data = row.original;
			return <p className="text-left ml-3">{data.email}</p>;
		},
		header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
	},
	{
		accessorKey: "role",
		cell: ({ row }) => {
			const data = row.original;
			return <p className="text-left ml-3">{data.role.role}</p>;
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
		cell: ({ row }) => <DeleteDialogUser data={row.original} setIsOpen={setIsOpen} setSelected={setSelected} />,
	},
];
