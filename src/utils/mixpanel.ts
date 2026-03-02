import { Mixpanel } from "mixpanel-react-native";

const MIXPANEL_TOKEN = "cdc92fbbd46f75a3d5815a3974167258";
const trackAutomaticEvents = false;
const mixpanel = new Mixpanel(MIXPANEL_TOKEN, trackAutomaticEvents);

export const initMixpanel = async () => {
	await mixpanel.init();
};

export const identifyUser = async (userId: string) => {
	if (!mixpanel) return;
	await mixpanel.identify(userId);
};

export const setUserProperties = async (
	properties: Record<string, unknown>,
) => {
	if (!mixpanel) return;
	const people = mixpanel.getPeople();
	await people.set(properties);
};

export const trackConnectionWithAcount = async () => {
	if (!mixpanel) return;
	mixpanel.track("Connexion authentifiée 🫡");
};

export const trackDeconnection = async () => {
	if (!mixpanel) return;
	mixpanel.track("Déconnexion 🚫");
};

export const trackPictureTaked = async (params?: Record<string, unknown>) => {
	if (!mixpanel) return;
	mixpanel.track("Photo prise 📸", params);
};

export const trackIaRequest = async (params?: Record<string, unknown>) => {
	if (!mixpanel) return;
	mixpanel.track("IA utilisée 🤖", params);
};

export const trackCuiteCreated = async (params?: Record<string, unknown>) => {
	if (!mixpanel) return;
	mixpanel.track("Cuite publiée ✅", params);
};
