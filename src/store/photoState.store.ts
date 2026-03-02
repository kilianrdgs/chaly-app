import { create } from "zustand";

interface PhotoState {
	hasTakenPhoto: boolean;
	mediaValidate: boolean;
	setHasTakenPhoto: (val: boolean) => void;
	setMediaValidate: (val: boolean) => void;
	resetPhotoState: () => void;
}

export const usePhotoState = create<PhotoState>((set) => ({
	hasTakenPhoto: false,
	mediaValidate: false,
	setHasTakenPhoto: (val) => set({ hasTakenPhoto: val }),
	setMediaValidate: (val) => set({ mediaValidate: val }),
	resetPhotoState: () => set({ hasTakenPhoto: false }),
}));
