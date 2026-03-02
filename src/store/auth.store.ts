import { create } from "zustand";

interface AuthentificationStore {
	phone: string;
	codeOtp: string;
	verification: boolean;
	blocked: boolean;
	verificationUsername: boolean;
	username: string;

	setPhone: (phone: string) => void;
	setCodeOtp: (code: string) => void;
	setVerificationUsername: (value: boolean) => void;
	setUsername: (username: string) => void;
	setVerification: (value: boolean) => void;
	setBlocked: (value: boolean) => void;
	reset: () => void;
}

const useAuthStore = create<AuthentificationStore>((set) => ({
	phone: "",
	codeOtp: "",
	verification: false,
	blocked: false,
	username: "",
	verificationUsername: false,

	setPhone: (phone) => set({ phone }),
	setCodeOtp: (codeOtp) => set({ codeOtp }),
	setUsername: (username) => set({ username }),
	setVerificationUsername: (verificationUsername) =>
		set({ verificationUsername }),
	setVerification: (verification) => set({ verification }),
	setBlocked: (blocked) => set({ blocked }),

	reset: () =>
		set({
			phone: "",
			codeOtp: "",
			username: "",
			verificationUsername: false,
			verification: false,
			blocked: false,
		}),
}));

export const authStore = {
	getState: useAuthStore.getState,
	setState: useAuthStore.setState,
	subscribe: useAuthStore.subscribe,

	setPhone: (phone: string) => useAuthStore.getState().setPhone(phone),
	setUsername: (username: string) =>
		useAuthStore.getState().setUsername(username),
	setVerificationUsername: (v: boolean) =>
		useAuthStore.getState().setBlocked(v),
	setCodeOtp: (code: string) => useAuthStore.getState().setCodeOtp(code),
	setVerification: (v: boolean) => useAuthStore.getState().setVerification(v),
	setBlocked: (v: boolean) => useAuthStore.getState().setBlocked(v),
	reset: () => useAuthStore.getState().reset(),
};

export default useAuthStore;
