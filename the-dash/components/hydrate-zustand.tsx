// HydrateZustand.tsx (client)
"use client";

import { User } from "@/lib/types";
import useAuthStore from "@/store/useAuthStore";
import { ReactNode, useEffect } from "react";

export default function HydrateZustand({ user, children }: { user: User | null; children: ReactNode }) {
	const setUser = useAuthStore((s) => s.login);

	useEffect(() => {
		if (user) setUser(user);
	}, [user]);

	return <>{children}</>;
}
