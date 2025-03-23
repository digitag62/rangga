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
import { createRole, updateRole } from "@/lib/actions";

const formSchema = z.object({
  role: z.string().min(1, { message: "This field has to be filled." }),
});

export function RoleForm({ role }: { role?: { id: string; role: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: role?.role || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsLoading(true);

    const res = role
      ? await updateRole(role?.id!, values)
      : await createRole(values);

    if (res.success) {
      toast({
        title: `${role ? "Updated" : "Created"} Successfully!`,
        description: res.message,
      });
      setIsLoading(false);

      router.push("/dashboard/settings/role");
    } else {
      toast({
        title: `${role ? "Updated" : "Created"} Failed!`,
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
          <div className="flex justify-center items-center gap-2 mt-2">
            <Link
              href="/dashboard/settings/role"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Cancel
            </Link>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
