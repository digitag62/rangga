"use client";

import { RoleProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { FormEvent, useState } from "react";
import { deleteRole } from "@/lib/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
		cell: ({ row }) => {
			const data = row.original;
			const [open, setOpen] = useState(false);
			const [load, setLoad] = useState(false);

			const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
				e.preventDefault();
				const res = await deleteRole(data.id);

				setLoad(true);
				const toastLoad = toast.loading("Please wait a sec.");

				if (!res.success) {
					setLoad(false);
					setOpen(false);
					toast.dismiss(toastLoad);
					toast.error("Delete failed! Please try again.");
				} else {
					setLoad(false);
					setOpen(false);
					toast.dismiss(toastLoad);
					toast.success("One item deleted successfully.");
				}
			};

			return (
				<Dialog open={open} onOpenChange={setOpen}>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => {
									setSelectedRole(data);
									setIsOpen(true);
								}}
							>
								Update
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DialogTrigger asChild>
								<DropdownMenuItem className="hover:cursor-pointer" variant="destructive">
									Delete
								</DropdownMenuItem>
							</DialogTrigger>
						</DropdownMenuContent>
					</DropdownMenu>
					{/* =========================================================== */}
					<DialogContent>
						<form onSubmit={onSubmit} className="flex flex-col gap-2">
							<DialogHeader>
								<DialogTitle>Are you absolutely sure?</DialogTitle>
								<DialogDescription>This action cannot be undone. Are you sure you want to permanently delete this item from our servers?</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button variant="outline" disabled={load}>
										Cancel
									</Button>
								</DialogClose>
								<Button type="submit" disabled={load}>
									{load ? "Loading..." : "Confirm"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			);
		},
	},
];
