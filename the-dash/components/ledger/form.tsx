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
import { LedgerProps } from "@/lib/ledger/types";
import { BookProps } from "@/lib/book/types";
import { CatProps } from "@/lib/cat/types";
import { redirect } from "next/navigation";

const formSchema = z.object({
	amount: z.coerce.number().min(1, { message: "This field has to be filled." }),
	remarks: z.string().min(1, { message: "This field has to be filled." }),
	type: z.enum(["EXP", "ERN", "SAV", "TRF"]),
	catId: z.string().min(1, { message: "This field has to be filled." }),
	bookId: z.string().min(1, { message: "This field has to be filled." }),
	isActive: z.string(),
});

export const LedgerForm = ({ data, books, cats, isOpen, setIsOpen }: { data: LedgerProps | null; books: BookProps[]; cats: CatProps[]; isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
	const [isLoading, setIsLoading] = useState(false);
	const isMobile = useIsMobile();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			type: "EXP",
			amount: 0,
			remarks: "",
			isActive: "true",
		},
	});

	useEffect(() => {
		if (isOpen) {
			form.reset({
				type: data?.type ?? "EXP",
				amount: parseFloat(data?.amount.toString()!) || 0,
				remarks: data?.remarks ?? "",
				catId: data?.cat.id ?? "",
				bookId: data?.book.id ?? "",
				isActive: data?.isActive?.toString() ?? "true",
			});
		}
	}, [isOpen, data, form]);

	const handleClose = () => {
		setIsOpen(false);
		form.reset();
	};

	const handleCategoryChange = (val: string) => {
		const url = "/cat";
		if (val === "new") redirect(url);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		const toastLoad = toast.loading("Loading...");

		const res = data ? await updateLedger(values, data.id, data.userId) : await createLedger(values);

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
								name="bookId"
								control={form.control}
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
								name="type"
								control={form.control}
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
								name="catId"
								control={form.control}
								render={({ field }) => {
									const selectedType = form.watch("type");
									const selectedBookId = form.watch("bookId");
									const filteredCats = cats?.filter((cat) => cat.type === selectedType && cat.book?.id === selectedBookId);
									return (
										<FormItem>
											<FormLabel>Category</FormLabel>
											<Select
												onValueChange={(value) => {
													field.onChange(value);
													handleCategoryChange(value);
												}}
												defaultValue={field.value}
											>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Select a Book" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="new">New Category</SelectItem>

													{cats &&
														filteredCats.map((cat) => (
															<SelectItem value={cat.id} key={cat.id}>
																{cat.cat}
															</SelectItem>
														))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
							<FormField
								name="amount"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Amount</FormLabel>
										<FormControl>
											<Input type="number" placeholder="amount" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="remarks"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Remarks</FormLabel>
										<FormControl>
											<Input type="text" placeholder="remarks" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="isActive"
								control={form.control}
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
