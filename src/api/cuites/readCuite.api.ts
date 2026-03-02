import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function getCuites(id: string | string[]) {
	const responseToken = await getToken();
	const response = await fetch(`${API_URL}/cuites/${id}`, {
		method: "GET",
		headers: {
			"x-api-key": API_KEY,
			Authorization: `Bearer ${responseToken}`,
		},
	});
	if (!response.ok) {
		throw new Error(`Erreur HTTP : ${response.status}`);
	}
	const data = await response.json();
	if (!data) {
		return null;
	}
	return data;
}
