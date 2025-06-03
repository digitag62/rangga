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

import { createCat, updateCat } from "@/lib/cat/actions";
import { CatProps } from "@/lib/cat/types";
import { BookProps } from "@/lib/book/types";

const formSchema = z.object({
	bookId: z.string().min(1, { message: "This field has to be filled." }),
	type: z.enum(["EXP", "ERN", "SAV", "TRF"]),
	cat: z.string().min(1, { message: "This field has to be filled." }),
	max: z.coerce.number().min(1, { message: "This field has to be filled." }),
	isActive: z.string(),
});

export const CatForm = ({ data, books, isOpen, setIsOpen }: { data: CatProps | null; books: BookProps[]; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [isLoading, setIsLoading] = useState(false);
	const isMobile = useIsMobile();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			bookId: "",
			type: "EXP",
			cat: "",
			max: 0,
			isActive: "true",
		},
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				bookId: data?.book.id ?? "",
				type: data?.type ?? "EXP",
				cat: data?.cat ?? "",
				max: parseFloat(data?.max.toString()!) ?? "",
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

		const res = data ? await updateCat(values, data.id, data.userId) : await createCat(values);

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
							<DrawerTitle>{data ? "Update" : "Create"} Category</DrawerTitle>
							<DrawerDescription>Manage category data below.</DrawerDescription>
						</DrawerHeader>
						<div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
							<FormField
								control={form.control}
								name="bookId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Book</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Select a Book" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{books &&
													books.map((book) => (
														<SelectItem value={book.id} key={book.id}>
															{book.name}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Type</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl className="w-full">
												<SelectTrigger>
													<SelectValue placeholder="Select a Type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="EXP">Expenses</SelectItem>
												<SelectItem value="ERN">Earnings</SelectItem>
												<SelectItem value="SAV">Saves</SelectItem>
												<SelectItem value="TRF">Transfers</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="cat"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<Input type="text" placeholder="Groceries" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="max"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Max Amount</FormLabel>
										<FormControl>
											<Input type="number" placeholder="5000" {...field} />
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
