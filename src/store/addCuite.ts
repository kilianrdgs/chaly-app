import { create } from "zustand";
import type { NewCuite } from "../models/cuites/Cuite.model";

interface NewCuitesStore {
	cuites: NewCuite;
	setCuites: (newCuites: NewCuite) => void;
	setReplyTo: (
		pseudo: string,
		defaultTitle: string,
		defaultDescription: string,
	) => void;
	setTitle: (title: string) => void;
	resetCuite: () => void;
	resetReplyCuite: () => void;
}

const baseState: Omit<NewCuite, "replyTo" | "lastTitle" | "lastDescription"> = {
	media: null,
	title: null,
	titles: [],
	description: null,
	date: null,
	location: null,
	confidentiality: 1,
};

const useNewCuitesStore = create<NewCuitesStore>((set) => ({
	cuites: {
		...baseState,
		replyTo: null,
		lastTitle: null,
		lastDescription: null,
	},

	setCuites: (newCuites) => set({ cuites: newCuites }),

	setReplyTo: (pseudo, defaultTitle, defaultDescription) =>
		set((state) => ({
			cuites: {
				...state.cuites,
				replyTo: pseudo,
				lastTitle: defaultTitle,
				lastDescription: defaultDescription,
			},
		})),

	setTitle: (title: string) =>
		set((state) => ({
			cuites: {
				...state.cuites,
				title,
			},
		})),

	resetCuite: () =>
		set((state) => ({
			cuites: {
				...baseState,
				replyTo: state.cuites.replyTo,
				lastTitle: state.cuites.lastTitle,
				lastDescription: state.cuites.lastDescription,
			},
		})),

	resetReplyCuite: () =>
		set((state) => ({
			cuites: {
				...state.cuites,
				replyTo: null,
				lastTitle: null,
				lastDescription: null,
			},
		})),
}));

export const addCuiteStore = {
	getState: useNewCuitesStore.getState,
	setState: useNewCuitesStore.setState,
	subscribe: useNewCuitesStore.subscribe,
	setNewCuite: (newcuite: NewCuite) =>
		useNewCuitesStore.getState().setCuites(newcuite),
	resetNewCuite: () => useNewCuitesStore.getState().resetCuite(),
};

export default useNewCuitesStore;
