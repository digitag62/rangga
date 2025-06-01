"use client";

import { useEffect } from "react";
// import { getAllUsers } from "@/lib/actions";
// import { UserWithRoleType } from "@/lib/types";
import useUserStore from "@/store/useUserStore";

const TTL_MS = 5 * 60 * 1000; // 5 minutes

const UserPage = () => {
	// const [users, setUsers] = useState<UserWithRoleType[]>();
	// const [load, setLoad] = useState(false);

	/*useEffect(() => {
		setLoad(true);
		const fetchData = async () => {
			const res = await getAllUsers();
			setLoad(false);
			setUsers(res.data);
		};

		fetchData().catch((err) => console.log(err));
	}, []);*/

	const { users, isLoading, fetchUsers, shouldRefetch } = useUserStore();

	useEffect(() => {
		if (!users || shouldRefetch(TTL_MS)) fetchUsers();
	}, [users, fetchUsers, shouldRefetch]);

	return <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{isLoading ? <div>Loading</div> : <div>{users && users.map((user) => user.email)}</div>}</div>;
};

export default UserPage;
