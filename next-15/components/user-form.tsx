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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { updateUser } from "@/lib/actions";

type User = {
  id: string;
  email: string;
  roleId: string;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  pwd: z
    .string()
    .min(6, { message: "This field has to be filled." })
    .optional()
    .or(z.literal("")),
  roleId: z.string().min(1, { message: "This field has to be filled." }),
});

export function UserForm({
  user,
  role,
}: {
  user?: User;
  role: { id: string; role: string }[];
}) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      pwd: "",
      roleId: user?.roleId || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsLoading(true);

    const res = await updateUser(user?.id!, values);

    if (res.success) {
      toast({
        title: `Updated Successfully!`,
        description: res.message,
      });
      setIsLoading(false);

      router.push("/dashboard/settings/user");
    } else {
      toast({
        title: `Updated Failed!`,
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Admin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pwd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="To update your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(value)}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a NavGroup" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {role.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center items-center gap-2 mt-2">
            <Link
              href="/dashboard/settings/user"
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
