"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { createNavGroup, createRole } from "@/lib/actions";

const formSchema = z.object({
  role: z.string().min(1, { message: "This field has to be filled." }),
});

export function RoleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsLoading(true);
    const res = await createRole({
      ...values,
      email: session?.user?.email!,
    });

    if (res.success) {
      toast({
        title: "Created Successfully!",
        description: res.message,
      });
      setIsLoading(false);

      router.push("/dashboard/settings/role");
    } else {
      toast({
        title: "Create Failed!",
        description: res.message,
      });
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Admin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            Submit
          </Button>
          <Link
            href="/dashboard/settings/role"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to Settings
          </Link>
        </div>
      </form>
    </Form>
  );
}
