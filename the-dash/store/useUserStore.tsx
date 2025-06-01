import { getAllUsers } from "@/lib/actions";
import { UserWithRoleType } from "@/lib/types";
import { create } from "zustand";

type UserStore = {
	users: UserWithRoleType[] | null;
	isLoading: boolean;
	lastFetched: number | null; // Unix timestamp (ms)
	fetchUsers: () => void;
	clearUsers: () => void;
	shouldRefetch: (ttlMs: number) => boolean;
};

const useUserStore = create<UserStore>((set, get) => ({
	users: null,
	isLoading: false,
	lastFetched: null,
	fetchUsers: async () => {
		set({ isLoading: true });
		try {
			const res = await getAllUsers();
			set({ users: res.data, lastFetched: Date.now(), isLoading: false });
		} catch (err) {
			console.error("Failed to fetch users:", err);
			set({ isLoading: false });
		}
	},
	clearUsers: () => set({ users: null }),
	shouldRefetch: (ttlMs) => {
		const lastFetched = get().lastFetched;
		return !lastFetched || Date.now() - lastFetched > ttlMs;
	},
}));

export default useUserStore;
