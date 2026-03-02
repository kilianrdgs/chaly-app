import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function getCuitesList(
	limit: number,
	nextCursor: string | null,
	type: string,
	pseudo: string,
	cuiteId: number | null = null,
) {
	const responseToken = await getToken();
	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	const response = await fetch(
		`${API_URL}/cuites/list?limit=${limit}&cursor=${nextCursor}&type=${type}&pseudo=${pseudo}&cuiteId=${
			cuiteId ?? null
		}`,
		{
			method: "GET",
			headers: {
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
			},
		},
	);

	if (!response.ok) {
		throw new Error(`Erreur HTTP : ${response.status}`);
	}

	const data = await response.json();

	return {
		cuites: data.cuites || [],
		nextCursor: data.cursor || null,
	};
}
