"use client";

import { LoginForm } from "@/components/login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LoginPage = () => {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<div className={cn("flex flex-col gap-6")}>
					<Card>
						<CardHeader>
							<CardTitle className="text-2xl">Login</CardTitle>
							<CardDescription>Enter your email below to login to your account</CardDescription>
						</CardHeader>
						<CardContent>
							<LoginForm />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
