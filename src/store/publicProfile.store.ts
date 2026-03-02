import { create } from "zustand";
import type { User } from "../models/users/User.model";
import type { Cuite } from "./cuites.store";

type PublicProfileMode = "scroll" | "profile";

type PublicProfileStore = {
	mode: PublicProfileMode;
	username: string | null;
	user: User | null;
	userPicture: string | null;

	description: string | null;
	certified: boolean;
	streakDays: number;
	totalCuites: number;
	backgroundName: string | null;

	cuites: Cuite[];
	nextCursor: string | null;
	loading: boolean;
	isEndReached: boolean;

	setProfileMode: (mode: PublicProfileMode) => void;
	setUsername: (username: string | null) => void;
	setUser: (user: User) => void;
	setUserPicture: (picture: string | null) => void;

	setDescription: (desc: string | null) => void;
	setCertified: (val: boolean) => void;
	setStreakDays: (val: number) => void;
	setTotalCuites: (val: number) => void;
	setBackgroundName: (val: string | null) => void;

	clearUser: () => void;
	addCuites: (newCuites: Cuite[], nextCursor: string | null) => void;
	reset: () => void;
	setLoading: (val: boolean) => void;
};

export const usePublicProfileStore = create<PublicProfileStore>((set) => ({
	mode: "scroll",
	username: null,
	user: null,
	userPicture: null,

	description: null,
	certified: false,
	streakDays: 0,
	totalCuites: 0,
	backgroundName: null,

	cuites: [],
	nextCursor: null,
	loading: false,
	isEndReached: false,

	setProfileMode: (mode) => set({ mode }),
	setUsername: (username) => set({ username }),

	setUser: (user) =>
		set({
			user,
			username: user.username ?? null,
			userPicture: user.profilePicture ?? null,
			description: user.description ?? null,
			certified: user.certified ?? false,
			streakDays: user.streakDays ?? 0,
			totalCuites: user.totalCuites ?? 0,
			backgroundName: user.backgroundName ?? null,
		}),

	setUserPicture: (picture) => set({ userPicture: picture }),

	setDescription: (desc) => set({ description: desc }),
	setCertified: (val) => set({ certified: val }),
	setStreakDays: (val) => set({ streakDays: val }),
	setTotalCuites: (val) => set({ totalCuites: val }),
	setBackgroundName: (val) => set({ backgroundName: val }),

	clearUser: () =>
		set({
			user: null,
			username: null,
			userPicture: null,
			description: null,
			certified: false,
			streakDays: 0,
			totalCuites: 0,
			cuites: [],
			nextCursor: null,
			loading: false,
			isEndReached: false,
		}),

	addCuites: (newCuites, nextCursor) =>
		set((state) => {
			const existingIds = new Set(state.cuites.map((c) => c.Id));
			const uniqueCuites = newCuites.filter((c) => !existingIds.has(c.Id));
			return {
				cuites: [...state.cuites, ...uniqueCuites],
				nextCursor,
				isEndReached: !nextCursor,
			};
		}),

	reset: () =>
		set({
			cuites: [],
			nextCursor: null,
			loading: false,
			isEndReached: false,
		}),

	setLoading: (val) => set({ loading: val }),
}));
