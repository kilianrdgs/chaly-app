import type { Cuite } from "../cuites/Cuite.model";

export interface BaseCuitesStore {
	cuites: Cuite[];
	nextCursor: string | null;
	loading: boolean;
	isEndReached: boolean;

	setCuites: (cuites: Cuite[], nextCursor: string | null) => void;
	addCuites: (newCuites: Cuite[], nextCursor: string | null) => void;
	setLoading: (value: boolean) => void;
	reset: () => void;
}

export interface ProfileCuitesStore extends BaseCuitesStore {
	prependCuite: (newCuite: Cuite) => void;
}
