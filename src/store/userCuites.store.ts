import { create } from "zustand";
import type { Cuite } from "./cuites.store";

interface ProfileCuitesStore {
	cuites: Cuite[];
	nextCursor: string | null;
	loading: boolean;
	isEndReached: boolean;

	setCuites: (cuites: Cuite[], nextCursor: string | null) => void;
	addCuites: (newCuites: Cuite[], nextCursor: string | null) => void;
	prependCuite: (newCuite: Cuite) => void;
	setLoading: (value: boolean) => void;
	reset: () => void;
}

const useProfileCuitesStore = create<ProfileCuitesStore>((set) => ({
	cuites: [],
	nextCursor: null,
	loading: false,
	isEndReached: false,

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

	setCuites: (cuites: Cuite[], nextCursor: string | null) =>
		set({
			cuites,
			nextCursor,
			isEndReached: !nextCursor,
		}),

	reset: () =>
		set({
			cuites: [],
			nextCursor: null,
			loading: false,
			isEndReached: false,
		}),

	prependCuite: (newCuite) =>
		set((state) => ({
			cuites: [newCuite, ...state.cuites],
		})),

	setLoading: (value) => set({ loading: value }),
}));

export { useProfileCuitesStore };
