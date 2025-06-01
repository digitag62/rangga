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

import { createBook, updateBook } from "@/lib/book/actions";
import { BookProps } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, { message: "This field has to be filled." }),
  summary: z.string().min(1, { message: "This field has to be filled." }),
  userId: z.string().min(1, { message: "This field has to be filled." }),
  isActive: z.string(),
});

export const BookForm = ({
  data,
  isOpen,
  setIsOpen
}: {
  data: BookProps | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      summary: "",
      userId: "",
      isActive: "true",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: data?.name ?? "",
        summary: data?.summary ?? "",
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

    const res = data ? await updateBook(values, data.id) : await createBook(values);

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
              <DrawerTitle>{data ? "Update" : "Create"} Book</DrawerTitle>
              <DrawerDescription>Manage book data below.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>summary</FormLabel>
                    <FormControl>
                      <Input placeholder="summary" {...field} />
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
