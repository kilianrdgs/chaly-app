import { create } from "zustand";
import type { User } from "../models/users/User.model";

interface UserStore {
	user: User | null;
	setUser: (cuites: User) => void;
	clearUser: () => void;
	updateProfilePicture: (newProfilePicture: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
	user: null,
	isAuthenticated: false,
	setUser: (newUser) => set({ user: newUser }),
	clearUser: () => set({ user: null }),
	updateProfilePicture: (newProfilePicture) =>
		set((state) => ({
			user: state.user
				? { ...state.user, profilePicture: newProfilePicture }
				: null,
		})),
}));

export const userStore = {
	getState: useUserStore.getState,
	setState: useUserStore.setState,
	subscribe: useUserStore.subscribe,
	setUser: (user: User) => useUserStore.getState().setUser(user),
	clearUser: () => useUserStore.getState().clearUser(),
	updateProfilePicture: (newProfilePicture: string) =>
		useUserStore.getState().updateProfilePicture(newProfilePicture),
};

export default useUserStore;
