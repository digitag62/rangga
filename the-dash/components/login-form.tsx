"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
	email: z.string().min(1, { message: "This field has to be filled." }).email("This is not a valid email."),
	password: z.string().min(6, { message: "This field has to be filled." }),
});

export function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		setIsLoading(true);
		// const res = await authenticate(values);
		const res = { success: false };

		if (res.success) {
			// toast({ title: "Signed In!", description: res.message });
			setIsLoading(false);

			router.push("/dashboard");
		} else {
			// toast({ title: "Sign Up Failed!", description: res.message });
			setIsLoading(false);
			form.reset();
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
								<FormLabel className="flex items-center">Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="*******" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Loading..." : "Login"}
					</Button>
				</div>
				<div className="mt-4 text-center text-sm text-muted-foreground">
					Don&apos;t have an account?{" "}
					<Link href="/register" className="underline decoration-dotted underline-offset-4 dot hover:text-accent-foreground hover:decoration-solid hover:underline-offset-4">
						Register
					</Link>
				</div>
			</form>
		</Form>
	);
}
