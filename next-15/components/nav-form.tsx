"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
import { MultiSelect } from "@/components/ui/multi-select";
import { authenticate, createNav } from "@/lib/actions";
import { slugify } from "@/lib/helpers";

const formSchema = z.object({
  title: z.string().min(1, { message: "This field has to be filled." }),
  url: z.string().min(1, { message: "This field has to be filled." }),
  group: z.string().min(1, { message: "This field has to be filled." }),
  access: z.string().min(1, { message: "This field has to be filled." }),
  isActive: z.string().min(1, { message: "This field has to be filled." }),
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
  const [selectedRole, setSelectedRole] = useState<string[]>([]);

  const { toast } = useToast();
  const router = useRouter();

  const roleOptions = role.map((r) => ({ value: r.role, label: r.role }));

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      isActive: "true",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsLoading(true);
    const url = slugify(values.title);
    const res = await createNav();

    if (res.success) {
      toast({
        title: "Created Successfully!",
        description: res.message,
      });
      setIsLoading(false);

      router.push("/dashboard/settings/nav");
    } else {
      toast({
        title: "Create Failed!",
        description: res.message,
      });
      setIsLoading(false);
      form.reset();
    }
  }

  const handleGroupChange = (val: string) => {
    const url = "/dashboard/settings/nav-group/create?ref=create-nav";
    if (val === "new") redirect(url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4">
          {/* navGroup */}
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NavGroup</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleGroupChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a NavGroup" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New NavGroup</SelectItem>
                    {navGroup.map((nav) => (
                      <SelectItem key={nav.id} value={nav.id}>
                        {nav.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* title */}
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
          {/* access */}
          <FormField
            control={form.control}
            name="access"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={roleOptions}
                    onValueChange={setSelectedRole}
                    defaultValue={selectedRole}
                    placeholder="Select role"
                    variant="inverted"
                    animation={0}
                    maxCount={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* isActive */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center gap-2 mt-2">
            <Link
              href="/dashboard/settings/nav"
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
