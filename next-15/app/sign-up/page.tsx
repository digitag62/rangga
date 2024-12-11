import React from "react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
          <div className="flex flex-col">
            <span className="flex justify-center text-sm py-4 text-muted-foreground bg-card">
              OR CONTINUE WITH
            </span>
            <Button variant="outline" className="w-full">
              Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
