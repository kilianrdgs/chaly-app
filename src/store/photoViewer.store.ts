// src/store/photoViewerStore.ts
import { create } from "zustand";

interface PhotoViewerData {
	title: string;
	description: string;
	urlPicture: string;
	UserPseudo: string;
	CuiteDate: string;
	cuiteId: number;
	UserPicture: string | null;
	LikeCount: number;
	LikedByMe: boolean;
	CommentCount: number;
	IsCertified: boolean;
}

interface PhotoViewerState {
	cuite: PhotoViewerData | null;
	setCuite: (data: PhotoViewerData) => void;
	resetCuite: () => void;
}

export const usePhotoViewerStore = create<PhotoViewerState>((set) => ({
	cuite: null,
	setCuite: (data) => set({ cuite: data }),
	resetCuite: () => set({ cuite: null }),
}));
