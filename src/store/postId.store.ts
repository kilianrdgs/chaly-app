import { create } from "zustand";

export const useNotificationStore = create<{
	postId: number | null;
	setPostId: (id: number | null) => void;
}>((set) => ({
	postId: null,
	setPostId: (id) => set({ postId: id }),
}));
