"use client";

import { NavGroupProps } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { deleteNavGroup } from "@/lib/actions";

export const columns: ColumnDef<NavGroupProps>[] = [
  {
    accessorKey: "title",
    cell: ({ row }) => {
      const data = row.original;

      return <p className="text-left pl-2">{data.title}</p>;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    accessorKey: "url",
    cell: ({ row }) => {
      const data = row.original;

      return <p className="text-left pl-2">{data.url}</p>;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;
      const [open, setOpen] = useState(false);
      const { toast } = useToast();

      const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await deleteNavGroup(data.id);

        if (!res.success) {
          setOpen(false);
          toast({
            variant: "destructive",
            title: "Delete Failed!",
            description: res.message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          setOpen(false);
          toast({
            variant: "default",
            title: "Action Fired!",
            description: res.message,
          });
        }
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/dashboard/settings/nav-group/${data.id}`}>
                  Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/dashboard/settings/nav-group/${data.id}/update`}>
                  Update nav-group
                </Link>
              </DropdownMenuItem>
              <DialogTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer">
                  Delete nav-group
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* =========================================================== */}
          <DialogContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Are you sure you want to
                  permanently delete this item from our servers?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
