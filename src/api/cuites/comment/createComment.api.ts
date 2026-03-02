import Constants from "expo-constants";
import { getToken } from "../../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function createComment(idPost: number, text: string) {
	const responseToken = await getToken();
	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	const response = await fetch(`${API_URL}/social/cuites/${idPost}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
			Authorization: `Bearer ${responseToken}`,
		},
		body: JSON.stringify({
			comment: text,
		}),
	});
	if (!response.ok) {
		throw new Error(`Erreur HTTP : ${response.status}`);
	}
	return true;
}
