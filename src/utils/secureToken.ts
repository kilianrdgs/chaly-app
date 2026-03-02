import * as SecureStore from "expo-secure-store";

export const storeToken = async (token: string) => {
	try {
		await SecureStore.setItemAsync("authToken", token);
		console.log("token stocké avec succès");
	} catch (error) {
		console.error("Erreur lors du stockage du token", error);
	}
};

export const getToken = async () => {
	try {
		const token = await SecureStore.getItemAsync("authToken");
		return token;
	} catch (error) {
		console.error("Erreur lors de la récupération du token", error);
	}
};

export const removeToken = async () => {
	try {
		await SecureStore.deleteItemAsync("authToken");
		console.log("Token supprimé avec succès");
	} catch (error) {
		console.error("Erreur lors de la suppression du token", error);
	}
};
