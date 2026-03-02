import Constants from "expo-constants";
import { getToken, removeToken, storeToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function verifyToken() {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	try {
		const response = await fetch(`${API_URL}/authentification/verify-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
			},
		});

		if (response.status === 401) {
			console.log("token invalide");
			await removeToken();
			return {
				success: response.status,
				message: "Token Invalide, déconnexion",
			};
		}

		console.log(responseToken);

		if (response.status === 200) {
			const data = await response.json();
			await storeToken(data);
			return { success: response.status, message: "Token Valide, connexion" };
		}
		return {
			success: response.status,
			message: `Erreur inattendue : ${response.status}`,
		};
	} catch (error) {
		console.error("Erreur lors de la vérif du token :", error);
		return { success: 500, message: "Erreur réseau, réessaie plus tard." };
	}
}
