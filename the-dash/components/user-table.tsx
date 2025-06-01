"use client";

import { useState } from "react";
import { RoleProps, UserWithRoleType } from "@/lib/types";
import { DataTable } from "@/components/ui/datatable";
import { userColumns } from "@/app/(dashboard)/user/user-columns";
import { UserForm } from "./user-form";
import useAuthStore from "@/store/useAuthStore";

export const UserTableClient = ({ data, roles }: { data: UserWithRoleType[]; roles: RoleProps[] }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState<UserWithRoleType | null>(null);

	const user = useAuthStore.useUser();

	const columns = userColumns({ user, setIsOpen, setSelected });

	return (
		<>
			<DataTable columns={columns} data={data} searchBy="email" url="/user" />

			<UserForm data={selected} isOpen={isOpen} setIsOpen={setIsOpen} roles={roles} user={user} />
		</>
	);
};
