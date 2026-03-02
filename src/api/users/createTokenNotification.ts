import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function createTokenNotification(
	tokenNotification: string,
) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	try {
		const response = await fetch(`${API_URL}/notifications`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${responseToken}`,
			},
			body: JSON.stringify({ token: tokenNotification }),
		});

		if (response.status === 201) {
			return { success: true, message: "Token notif inséré" };
		}
	} catch (error) {
		return {
			success: false,
			message: `Erreur réseau : ${error}`,
		};
	}
}
