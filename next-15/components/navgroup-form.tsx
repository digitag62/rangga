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
import { createNavGroup } from "@/lib/actions";

const formSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  url: z.string().min(1, { message: "This field has to be filled." }),
  icon: z.string().min(1, { message: "This field has to be filled." }),
});

export function NavGroupForm({
  navId,
  referal,
}: {
  navId: string | null;
  referal: string | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const { toast } = useToast();
  const router = useRouter();

  let redirectPath = "";
  if (referal === "create-nav") {
    redirectPath = "/dashboard/settings/nav/create";
  } else if (referal === "update-nav") {
    redirectPath = `/dashboard/settings/nav/${navId}/update`;
  } else {
    redirectPath = "/dashboard/settings/nav-group";
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsLoading(true);
    const res = await createNavGroup({
      ...values,
      email: session?.user?.email!,
    });

    if (res.success) {
      toast({
        title: "Created Successfully!",
        description: res.message,
      });
      setIsLoading(false);

      router.push(redirectPath);
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Menu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="/dashboard/your/path"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="SettingsIcon" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            Submit
          </Button>
          <Link
            href={redirectPath}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to Settings
          </Link>
        </div>
      </form>
    </Form>
  );
}
