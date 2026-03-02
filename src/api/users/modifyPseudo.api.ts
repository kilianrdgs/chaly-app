import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function modifyPseudo(username: string) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	try {
		const response = await fetch(`${API_URL}/users/${username}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
			},
		});

		if (response.status === 200) {
			return { success: true, message: "Pseudo modifié" };
		}
	} catch (error) {
		console.error("Erreur lors de la modif du pseudo :", error);
		return { success: false, message: "Erreur réseau, réessaie plus tard." };
	}
}
