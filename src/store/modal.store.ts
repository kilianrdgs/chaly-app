// store/modal.store.ts
import { create } from "zustand";

type ModalType = "comments" | "likes";

type ModalStore = {
	isVisible: boolean;
	postId: number | null;
	modalType: ModalType | null;
	onCommentAdded?: () => void;
	onCommentDeleted?: () => void;
	showModal: (
		id: number,
		type: ModalType,
		onCommentAdded?: () => void,
		onCommentDeleted?: () => void,
	) => void;
	hideModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
	isVisible: false,
	postId: null,
	modalType: null,
	onCommentAdded: undefined,
	onCommentDeleted: undefined,

	showModal: (id, type, onCommentAdded, onCommentDeleted) =>
		set({
			postId: id,
			modalType: type,
			isVisible: true,
			onCommentAdded,
			onCommentDeleted,
		}),

	hideModal: () =>
		set({
			isVisible: false,
			postId: null,
			modalType: null,
			onCommentAdded: undefined,
			onCommentDeleted: undefined,
		}),
}));
