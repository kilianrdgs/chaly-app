import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function getInformationsUser(pseudo: string) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token" };
	}

	try {
		const response = await fetch(`${API_URL}/users/${pseudo}`, {
			method: "GET",
			headers: {
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${responseToken}`,
			},
		});
		if (!response.ok) {
			console.error(`Erreur HTTP : ${response.status}`);
			return { success: false, message: `Erreur serveur (${response.status})` };
		}

		const data = await response.json();

		return { success: true, user: data };
	} catch (error) {
		console.error("Erreur dans getMyInfos():", error);
		return { success: false, message: "Erreur réseau, réessaie plus tard." };
	}
}
