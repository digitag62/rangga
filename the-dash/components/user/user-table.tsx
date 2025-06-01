"use client";

import { useState } from "react";

import { DataTable } from "@/components/ui/datatable";
import { userColumns } from "@/components/user/user-columns";
import { UserForm } from "@/components/user/user-form";

import { RoleProps } from "@/lib/types";
import { UserWithRoleProps } from "@/lib/user/types";

export const UserTableClient = ({ data, roles }: { data: UserWithRoleProps[]; roles: RoleProps[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<UserWithRoleProps | null>(null);

	const columns = userColumns({ setIsOpen, setSelected });

	return (
		<>
			<DataTable columns={columns} data={data} searchBy="email" url="/user" />
			<UserForm data={selected} isOpen={isOpen} setIsOpen={setIsOpen} roles={roles} />
		</>
	);
};
