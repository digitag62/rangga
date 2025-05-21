"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { createUser } from "@/lib/actions";

const formSchema = z
	.object({
		email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
		password: z.string().min(6, { message: "This field has to be filled." }),
		repspassword: z.string().min(6, { message: "This field has to be filled." }),
	})
	.refine(
		(values) => {
			return values.password === values.repspassword;
		},
		{
			message: "Passwords must match!",
			path: ["repspassword"],
		}
	);

export function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			repspassword: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);
		const toastLoad = toast.loading("Loading..");

		const res = await createUser(values);

		if (!res.success) {
			setIsLoading(false);
			toast.dismiss(toastLoad);
			toast.error("Something went wrong, please try again!");
		} else {
			setIsLoading(false);
			toast.dismiss(toastLoad);
			toast.success("Register success, please try to login!");

			router.push("/login");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="m@example.com" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="repspassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Loading..." : "Create account"}
					</Button>
				</div>
				<div className="mt-4 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link href="/login" className="underline decoration-dotted underline-offset-4 dot hover:text-accent-foreground hover:decoration-solid hover:underline-offset-4">
						Login
					</Link>
				</div>
			</form>
		</Form>
	);
}
