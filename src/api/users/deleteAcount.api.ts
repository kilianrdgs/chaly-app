import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function deleteAcount() {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token" };
	}

	try {
		const response = await fetch(`${API_URL}/users`, {
			method: "DELETE",
			headers: {
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${responseToken}`,
			},
		});
		if (!response.ok) {
			console.error(`Erreur HTTP : ${response.status}`);
			return { success: false, message: `Erreur serveur (${response.status})` };
		}

		if (response.status === 202) {
			return { success: true, message: "Compte supprimé" };
		}
	} catch (error) {
		console.error("Erreur dans getMyInfos():", error);
		return { success: false, message: "Erreur réseau, réessaie plus tard." };
	}
}
