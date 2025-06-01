"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";
import { createRole, updateRole } from "@/lib/actions";
import { RoleProps } from "@/lib/types";

const formSchema = z.object({
	role: z.string().min(1, { message: "This field has to be filled." }),
	isActive: z.string(),
});

export const RoleForm = ({ data, isOpen, setIsOpen }: { data: RoleProps | null; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [isLoading, setIsLoading] = useState(false);
	const isMobile = useIsMobile();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			role: "",
			isActive: "true",
		},
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				role: data?.role ?? "",
				isActive: data?.isActive.toString() ?? "true",
			});
		}
	}, [isOpen, data, form]);

	const handleClose = () => {
		setIsOpen(false);
		form.reset();
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		const toastLoad = toast.loading("Loading..");

		const res = data ? await updateRole(values, data.id) : await createRole(values);

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
							<DrawerTitle>{data ? "Update" : "Create"} Role</DrawerTitle>
							<DrawerDescription>A role will be assigned to the user to enable access control.</DrawerDescription>
						</DrawerHeader>
						<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
							<div className="flex flex-col gap-3">
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Role</FormLabel>
											<FormControl>
												<Input type="text" placeholder="SUPERADMIN" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<FormField
									control={form.control}
									name="isActive"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Status</FormLabel>
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
						</div>
						<DrawerFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading ? "Loading" : "Submit"}
							</Button>
							<DrawerClose asChild>
								<Button variant="outline">Done</Button>
							</DrawerClose>
						</DrawerFooter>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};
