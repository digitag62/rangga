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

const formSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  url: z.string().min(1, { message: "This field has to be filled." }),
  group: z.string().min(1, { message: "This field has to be filled." }),
});

interface navFormProps {
  navGroup: {
    id: string;
    title: string;
    url: string;
  }[];
  role: {
    role: string;
  }[];
}

export function NavForm({ navGroup, role }: navFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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
    // const res = await authenticate(values);

    // if (res.success) {
    //   toast({
    //     title: "Created Successfully!",
    //     description: res.message,
    //   });
    //   setIsLoading(false);

    //   router.push("/dashboard/settings/nav");
    // } else {
    //   toast({
    //     title: "Create Failed!",
    //     description: res.message,
    //   });
    //   setIsLoading(false);
    //   form.reset();
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NavGroup</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a NavGroup" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {navGroup.map((nav) => (
                      <SelectItem value={nav.id}>{nav.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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

          <Button type="submit" className="w-full">
            Login
          </Button>
          <Link
            href="/dashboard/settings/nav"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Back to Settings
          </Link>
        </div>
      </form>
    </Form>
  );
}
