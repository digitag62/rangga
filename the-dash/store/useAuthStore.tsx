import { UserProps } from "@/lib/user/types";
import { createSelectorHooks } from "auto-zustand-selectors-hook";
import { produce } from "immer";
import { create } from "zustand";

type AuthStoreType = {
	user: UserProps | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (user: UserProps) => void;
	logout: () => void;
	stopLoading: () => void;
};

const useAuthStoreBase = create<AuthStoreType>((set) => ({
	user: null,
	isAuthenticated: false,
	isLoading: true,
	login: (user) => {
		// localStorage.setItem("token", user.token);
		set(
			produce<AuthStoreType>((state) => {
				state.isAuthenticated = true;
				state.user = user;
			})
		);
	},
	logout: () => {
		localStorage.removeItem("token");
		set(
			produce<AuthStoreType>((state) => {
				state.isAuthenticated = false;
				state.user = null;
			})
		);
	},
	stopLoading: () => {
		set(
			produce<AuthStoreType>((state) => {
				state.isLoading = false;
			})
		);
	},
}));

const useAuthStore = createSelectorHooks(useAuthStoreBase);

export default useAuthStore;
