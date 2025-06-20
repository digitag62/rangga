import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { deleteLedger } from "@/lib/ledger/actions";
import { LedgerProps } from "@/lib/ledger/types";

export const DeleteDialogLedger = ({ data, setIsOpen, setSelectedLedger }: { data: LedgerProps; setIsOpen: (val: boolean) => void; setSelectedLedger: (Ledger: LedgerProps | null) => void }) => {
	const [open, setOpen] = useState(false);
	const [load, setLoad] = useState(false);

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = await deleteLedger(data.id, data.userId ?? "");

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
							setSelectedLedger(data);
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
};
