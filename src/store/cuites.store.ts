import { create } from "zustand";

export interface Cuite {
	Id: number;
	Titre: string;
	Description: string;
	Id_User: number;
	CuiteDate: string;
	UrlPicture: string;
	UserPseudo: string;
	UserPicture: string | null;
	LikeCount: number;
	LikedByMe: boolean;
	CommentCount: number;
	IsCertified: boolean | null;
}

interface CuitesScrollStore {
	cuites: Cuite[];
	nextCursor: string | null;
	loading: boolean;
	isEndReached: boolean;
	hasFetched: boolean;
	lastFetched: number | null;

	setCuites: (cuites: Cuite[], nextCursor: string | null) => void;
	addCuites: (newCuites: Cuite[], nextCursor: string | null) => void;
	setLoading: (value: boolean) => void;
	reset: () => void;
	setHasFetched: (val: boolean) => void;
	setLastFetched: (timestamp: number) => void;
	shouldRefetch: (ttlMs?: number) => boolean;
}

const useCuitesScrollStore = create<CuitesScrollStore>((set, get) => ({
	cuites: [],
	nextCursor: null,
	loading: false,
	isEndReached: false,
	hasFetched: false,
	lastFetched: null,

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

	setLoading: (value) => set({ loading: value }),

	setHasFetched: (val) => set({ hasFetched: val }),

	setLastFetched: (timestamp) => set({ lastFetched: timestamp }),

	shouldRefetch: (ttlMs = 30_000) => {
		const { hasFetched, lastFetched } = get();
		if (!hasFetched || !lastFetched) return true;
		return Date.now() - lastFetched > ttlMs;
	},
}));

export { useCuitesScrollStore };
