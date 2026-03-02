import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function modifyBackgroundName(name: string) {
	const token = await getToken();
	if (!token) return { success: false, message: "Aucun token" };

	try {
		const res = await fetch(`${API_URL}/users/background-color`, {
			method: "PATCH",
			headers: {
				"x-api-key": API_KEY ?? "",
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ color: name }),
		});
		if (!res.ok) return { success: false, message: `Erreur ${res.status}` };
		return { success: true };
	} catch {
		return { success: false, message: "Erreur réseau" };
	}
}
