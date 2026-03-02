import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function deleteCuite(idCuite: number) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	const response = await fetch(`${API_URL}/cuites/${idCuite}`, {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
			Authorization: `Bearer ${responseToken}`,
		},
	});

	if (response.status === 202) {
		return true;
	}

	return false;
}
