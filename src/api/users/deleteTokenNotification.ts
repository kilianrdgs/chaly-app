import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function DeleteTokenNotification() {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	try {
		const response = await fetch(`${API_URL}/notifications`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${responseToken}`,
			},
		});

		if (response.status === 200) {
			return { success: true, message: "Token notif supprimé" };
		}
	} catch (error) {
		return {
			success: false,
			message: `Erreur réseau : ${error}`,
		};
	}
}
