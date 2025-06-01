const fs = require("fs");
const path = require("path");

const prismaPath = path.join(process.cwd(), "prisma", "schema.prisma");
const outputBase = process.cwd();

const skipFields = ["id", "createdAt", "createdBy", "updatedAt", "updatedBy", "deletedAt"];

const prismaToType = (type: string) => {
	switch (type) {
		case "String":
			return "string";
		case "Int":
		case "Float":
			return "number";
		case "Boolean":
			return "boolean";
		case "DateTime":
			return "Date";
		default:
			return "any"; // fallback for relations or unknown types
	}
};

const extractModels = (schema: string) => {
	const modelRegex = /model\s+(\w+)\s+{([^}]*)}/g;
	const models: { name: string; fields: { name: string; type: string; optional: boolean; isArray: boolean; isRelation: boolean }[] }[] = [];
	let match;

	while ((match = modelRegex.exec(schema))) {
		const [, modelName, body] = match;
		const fields = [...body.matchAll(/^\s*(\w+)\s+(\w+)(\??)(\[\])?(?:\s+@.*)?$/gm)]
			.map(([, name, type, optional, array]) => ({
				name,
				type,
				optional: optional === "?",
				isArray: array === "[]",
				isRelation: /^[A-Z]/.test(type) && !["String", "Boolean", "DateTime", "Int", "Float", "Decimal", "BigInt", "Json", "Bytes"].includes(type),
			}))
			.filter((f) => !skipFields.includes(f.name) && f.isArray !== true && f.isRelation !== true);
		models.push({ name: modelName, fields });
	}

	return models;
};

const toKebabCase = (str: string) => str.replace(/[A-Z]/g, (letter, idx) => (idx === 0 ? letter.toLowerCase() : `-${letter.toLowerCase()}`));

const writeFileSafely = (filePath: string, content: string) => {
	if (fs.existsSync(filePath)) {
		console.log(`🟡 Skipped (exists): ${filePath}`);
		return;
	}
	fs.mkdirSync(path.dirname(filePath), { recursive: true });
	fs.writeFileSync(filePath, content);
	console.log(`✅ Created: ${filePath}`);
};

const generateFiles = (model: { name: string; fields: { name: string; type: string }[] }) => {
	const name = model.name;
	const kebabName = toKebabCase(name);
	const plural = `${name}s`;

	const modelImportPath = (type: "page" | "components" | "lib") => (type === "page" ? `@/components/${kebabName}/columns` : type === "components" ? `@/lib/${kebabName}/actions` : "");

	// --- 1. page.tsx ---
	const pageContent = `import { Suspense } from "react";
import { prismadb } from "@/lib/prismadb";
import { ${name}TableClient } from "@/components/${kebabName}/${kebabName}-table";

const ${name}Page = async () => {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <Suspense fallback={<div>Loading...</div>}>
          <Content />
        </Suspense>
      </div>
    </div>
  );
};

const Content = async () => {
  const data = await prismadb.${name.toLowerCase()}.findMany({
    select: {
      id: true,
      ${model.fields.map((f) => `${f.name}: true,`).join("\n      ")}
    },
    // where: { NOT: { role: "ADMIN" } }, // example filter if needed
  });

  return <${name}TableClient data={data} />;
};

export default ${name}Page;
`;

	// --- 2. columns.tsx ---
	const columns = model.fields
		.map(({ name: fName, type }) => {
			if (fName === "isActive") {
				return `{
    accessorKey: "${fName}",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="w-32">
          <Badge variant="outline" className={cn(data.${fName} ? "text-emerald-600" : "text-red-600", "px-1.5 text-left ml-3")}>
            {data.${fName} ? "Active" : "Inactive"}
          </Badge>
        </div>
      );
    },
    header: ({ column }) => <DataTableColumnHeader column={column} title="${fName.charAt(0).toUpperCase() + fName.slice(1)}" />,
  },`;
			} else {
				return `{
    accessorKey: "${fName}",
    cell: ({ row }) => <p className="text-left ml-3">{row.original.${fName}}</p>,
    header: ({ column }) => <DataTableColumnHeader column={column} title="${fName.charAt(0).toUpperCase() + fName.slice(1)}" />,
  },`;
			}
		})
		.join("\n");

	const columnsContent = `"use client";

import { ${name}Props } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/datatable-column-header";
import { FormEvent, useState } from "react";
import { delete${name} } from "@/lib/${kebabName}/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const columns = ({ setIsOpen, setSelected${name} }: { setIsOpen: (val: boolean) => void; setSelected${name}: (${name}: ${name}Props | null) => void }): ColumnDef<${name}Props>[] => [
${columns}
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const data = row.original;
      const [open, setOpen] = useState(false);
      const [load, setLoad] = useState(false);

      const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await delete${name}(data.id);

        setLoad(true);
        const toastLoad = toast.loading("Please wait a sec.");

        if (!res.success) {
          setLoad(false);
          setOpen(false);
          toast.dismiss(toastLoad);
          toast.error("Delete failed! Please try again.");
        } else {
          setLoad(false);
          setOpen(false);
          toast.dismiss(toastLoad);
          toast.success("One item deleted successfully.");
        }
      };

      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:cursor-pointer">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setSelected${name}(data);
                setIsOpen(true);
              }}>
                Update
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DialogTrigger asChild>
                <DropdownMenuItem className="hover:cursor-pointer" variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-2">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>This action cannot be undone. Are you sure you want to permanently delete this item from our servers?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" disabled={load}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={load}>
                  {load ? "Loading..." : "Confirm"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
  },
];
`;

	// --- 3. form.tsx ---
	const formInputs = model.fields
		.map((f) => {
			return `        <div className="space-y-2">
          <label htmlFor="${f.name}">${f.name}</label>
          <input id="${f.name}" name="${f.name}" defaultValue={item?.${f.name} ?? ""} />
        </div>`;
		})
		.join("\n");

	const formContent = `\
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import { create${name}, update${name} } from "@/lib/${kebabName}/actions";
import { ${name}Props } from "@/lib/types";

const formSchema = z.object({
${model.fields
	.filter((f) => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt")
	.map((f) => {
		if (f.type === "Boolean") return `  ${f.name}: z.string(),`;
		return `  ${f.name}: z.string().min(1, { message: "This field has to be filled." }),`;
	})
	.join("\n")}
});

export const ${name}Form = ({
  data,
  isOpen,
  setIsOpen
}: {
  data: ${name}Props | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
${model.fields
	.filter((f) => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt")
	.map((f) => {
		if (f.type === "Boolean") return `      ${f.name}: "true",`;
		return `      ${f.name}: "",`;
	})
	.join("\n")}
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
${model.fields
	.filter((f) => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt")
	.map((f) => {
		if (f.type === "Boolean") return `        ${f.name}: data?.${f.name}?.toString() ?? "true",`;
		return `        ${f.name}: data?.${f.name} ?? "",`;
	})
	.join("\n")}
      });
    }
  }, [isOpen, data, form]);

  const handleClose = () => {
    setIsOpen(false);
    form.reset();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const toastLoad = toast.loading("Loading...");

    const res = data ? await update${name}(values, data.id) : await create${name}(values);

    if (!res.success) {
			setIsLoading(false);
			toast.dismiss(toastLoad);
			toast.error(res.message);

			form.reset();
		} else {
			setIsLoading(false);
			setIsOpen(false);
			toast.dismiss(toastLoad);
			toast.success(res.message);

			form.reset();
		}
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"} open={isOpen} onClose={handleClose}>
      <DrawerContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DrawerHeader className="gap-1">
              <DrawerTitle>{data ? "Update" : "Create"} ${name}</DrawerTitle>
              <DrawerDescription>Manage ${name.toLowerCase()} data below.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
${model.fields
	.filter((f) => f.name !== "id" && f.name !== "createdAt" && f.name !== "updatedAt")
	.map((f) => {
		if (f.type === "Boolean") {
			return `              <FormField
                control={form.control}
                name="${f.name}"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>${f.name}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
												<FormControl className="w-full">
													<SelectTrigger>
														<SelectValue placeholder="Select a Status" />
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
              />`;
		}
		return `              <FormField
                control={form.control}
                name="${f.name}"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>${f.name}</FormLabel>
                    <FormControl>
                      <Input placeholder="${f.name}" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />`;
	})
	.join("\n")}
            </div>
            <DrawerFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading" : "Submit"}
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
`;

	// --- 4. actions.ts ---
	const actionContent = `\
"use server";

import { prismadb } from "@/lib/prismadb";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/lib/actions";
import { ${name}Payload } from "@/lib/types";

export const getAll${plural} = async () => {
  try {
    const data = await prismadb.${name.toLowerCase()}.findMany();
    return { success: true, message: "Fetch success", data };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Fetch failed", data: null };
  }
};

export const create${name} = async (payload: ${name}Payload) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.${name.toLowerCase()}.create({
      data: {
${model.fields.map((f) => `        ${f.name}: payload.${f.name},`).join("\n")}
        createdBy: sessionCheck.data?.email!,
      },
    });

    revalidatePath("/${kebabName}");
    return { success: true, message: "Create ${name}: Success" };
  } catch (error) {
    return handlePrismaError(error, "${name}");
  }
};

export const update${name} = async (payload: ${name}Payload, id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.${name.toLowerCase()}.update({
      data: {
${model.fields.map((f) => `        ${f.name}: payload.${f.name},`).join("\n")}
        updatedBy: sessionCheck.data?.email!,
      },
      where: { id },
    });

    revalidatePath("/${kebabName}");
    return { success: true, message: "Update ${name}: Success" };
  } catch (error) {
    return handlePrismaError(error, "${name}");
  }
};

export const delete${name} = async (id: string) => {
  const sessionCheck = await checkSession("admin-only");
  if (!sessionCheck.success) return { success: false, message: sessionCheck.message };

  try {
    await prismadb.${name.toLowerCase()}.delete({ where: { id } });
    revalidatePath("/${kebabName}");
    return { success: true, message: "Delete ${name}: Success" };
  } catch (error) {
    return handlePrismaError(error, "${name}");
  }
};

// Error handler
const handlePrismaError = (error: any, label: string) => {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
    switch (error.code) {
      case "P2002":
        return { success: false, message: \`\${label} already exists. It must be unique.\` };
      case "P2003":
        return { success: false, message: \`Cannot delete \${label}: Foreign key constraint failed.\` };
      case "P2016":
        return { success: false, message: "Reference not found" };
      case "P2025":
        return { success: false, message: "Record not found" };
      default:
        return { success: false, message: \`Known request error: \${error.message}\` };
    }
  }

  return { success: false, message: "An unexpected error occurred." };
};
`;

	// --- 5. {model}-table.tsx ---
	const tableClientContent = `"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import { ${name}Props } from "@/lib/types";
import { ${name}Form } from "@/components/${kebabName}/form";
import { columns as getColumns } from "@/components/${kebabName}/columns";

export const ${name}TableClient = ({ data }: { data: ${name}Props[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected${name}, setSelected${name}] = useState<${name}Props | null>(null);

  const columns = getColumns({ setIsOpen, setSelected${name} });

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        searchBy="${model.fields[0]?.name}"
        url="/${kebabName}"
        createForm={
          <Button
            variant="outline"
            className="text-foreground w-fit px-0 text-left"
            onClick={() => {
              setSelected${name}(null);
              setIsOpen(true);
            }}
          >
            <PlusCircle />
            New
          </Button>
        }
      />

      <${name}Form data={selected${name}} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
`;

	// Write files
	writeFileSafely(path.join(outputBase, "app", "(dashboard)", kebabName, "page.tsx"), pageContent);
	writeFileSafely(path.join(outputBase, "components", kebabName, "columns.tsx"), columnsContent);
	writeFileSafely(path.join(outputBase, "components", kebabName, "form.tsx"), formContent);
	writeFileSafely(path.join(outputBase, "lib", kebabName, "actions.ts"), actionContent);
	writeFileSafely(path.join(outputBase, "components", kebabName, `${kebabName}-table.tsx`), tableClientContent);
};

// Main
const run = () => {
	const schema = fs.readFileSync(prismaPath, "utf-8");
	const models = extractModels(schema);

	for (const model of models) {
		generateFiles(model);
	}
};

run();

//  pnpm exec ts-node scripts/generated-crud.ts
