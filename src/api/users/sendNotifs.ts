import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function sendNotifs(sendTo: string) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	try {
		const response = await fetch(`${API_URL}/users/send-notif`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
			},
			body: JSON.stringify({
				pseudo: sendTo,
				type: 1,
			}),
		});

		if (response.status === 200) {
			return { success: true, message: "Notification envoyé" };
		}
	} catch (error) {
		console.error("Erreur lors de la notif :", error);
		return { success: false, message: "Erreur réseau, réessaie plus tard." };
	}
}
