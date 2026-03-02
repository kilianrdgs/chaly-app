import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function ping() {
	try {
		const response = await fetch(`${API_URL}/authentification/ping`, {
			method: "GET",
			headers: {
				"x-api-key": API_KEY,
			},
		});

		if (!response.ok) return false;

		return true;
	} catch (error) {
		console.error("Erreur lors du ping API:", error);
		return false;
	}
}
