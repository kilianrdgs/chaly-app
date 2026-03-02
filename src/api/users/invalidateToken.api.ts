import Constants from "expo-constants";
import { getToken, removeToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function invalidateToken() {
	const responseToken = await getToken();
	if (!responseToken) {
		return console.log("aucun token a invalider");
	}

	const response = await fetch(`${API_URL}/users/invalidate-token`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
		},
		body: JSON.stringify({ token: responseToken }),
	});
	removeToken();
	return;
}
