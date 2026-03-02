import Constants from "expo-constants";
import normalizePhone from "../../utils/normalizePhone";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function requestCode(phone: string) {
	const normalizedNumber = await normalizePhone(phone);

	const response = await fetch(`${API_URL}/authentification/request-code`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
		},
		body: JSON.stringify({ phone: normalizedNumber }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Erreur serveur");
	}

	const data = await response.json();
	return data;
}
