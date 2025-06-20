// HydrateZustand.tsx (client)
"use client";

import { UserProps } from "@/lib/user/types";
import useAuthStore from "@/store/useAuthStore";
import { ReactNode, useEffect } from "react";

export default function HydrateZustand({ user, children }: { user: UserProps | null; children: ReactNode }) {
	const setUser = useAuthStore((s) => s.login);

	useEffect(() => {
		if (user) setUser(user);
	}, [user, setUser]);

	return <>{children}</>;
}
