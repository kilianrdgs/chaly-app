import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function modifyDescription(description: string) {
	const responseToken = await getToken();
	const desc = (description || "").trim();

	if (!responseToken) {
		return { success: false, message: "Aucun Token" };
	}

	try {
		const response = await fetch(`${API_URL}/users/description`, {
			method: "PATCH",
			headers: {
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${responseToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ description: desc }),
		});

		const txt = await response.text();
		const json = txt ? JSON.parse(txt) : undefined;

		if (!response.ok) {
			console.error(`Erreur HTTP : ${response.status}`);
			return { success: false, message: `Erreur serveur (${response.status})` };
		}

		return { success: true, data: json, message: json?.message || "OK" };
	} catch (error) {
		return { success: false, message: "Erreur réseau, réessaie plus tard." };
	}
}
