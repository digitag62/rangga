"use client";

import { RegisterForm } from "@/components/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const RegisterPage = () => {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className={cn("flex flex-col gap-6")}>
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">Create an account</CardTitle>
							<CardDescription>Enter your email below to create an account</CardDescription>
						</CardHeader>
						<CardContent>
							<RegisterForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
