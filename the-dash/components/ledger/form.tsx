"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { createLedger, updateLedger } from "@/lib/ledger/actions";
import { LedgerProps } from "@/lib/types";

const formSchema = z.object({
  amount: z.string().min(1, { message: "This field has to be filled." }),
  remarks: z.string().min(1, { message: "This field has to be filled." }),
  catId: z.string().min(1, { message: "This field has to be filled." }),
  bookId: z.string().min(1, { message: "This field has to be filled." }),
  userId: z.string().min(1, { message: "This field has to be filled." }),
  isActive: z.string(),
});

export const LedgerForm = ({
  data,
  isOpen,
  setIsOpen
}: {
  data: LedgerProps | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      remarks: "",
      catId: "",
      bookId: "",
      userId: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: data?.amount ?? "",
        remarks: data?.remarks ?? "",
        catId: data?.catId ?? "",
        bookId: data?.bookId ?? "",
        userId: data?.userId ?? "",
        isActive: data?.isActive?.toString() ?? "true",
      });
    }
  }, [isOpen, data, form]);

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastLoad = toast.loading("Loading...");

    const res = data ? await updateLedger(values, data.id) : await createLedger(values);

    if (!res.success) {
			setIsLoading(false);
			toast.dismiss(toastLoad);
			toast.error(res.message);

			form.reset();
		} else {
			setIsLoading(false);
			setIsOpen(false);
			toast.dismiss(toastLoad);
			toast.success(res.message);

			form.reset();
		}
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DrawerHeader className="gap-1">
              <DrawerTitle>{data ? "Update" : "Create"} Ledger</DrawerTitle>
              <DrawerDescription>Manage ledger data below.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>amount</FormLabel>
                    <FormControl>
                      <Input placeholder="amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>remarks</FormLabel>
                    <FormControl>
                      <Input placeholder="remarks" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="catId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>catId</FormLabel>
                    <FormControl>
                      <Input placeholder="catId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bookId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>bookId</FormLabel>
                    <FormControl>
                      <Input placeholder="bookId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>userId</FormLabel>
                    <FormControl>
                      <Input placeholder="userId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>isActive</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Select a Status" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="true">Active</SelectItem>
													<SelectItem value="false">Inactive</SelectItem>
												</SelectContent>
											</Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading" : "Submit"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
