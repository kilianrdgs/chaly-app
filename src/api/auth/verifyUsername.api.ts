import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function verifyUsername(text: string) {
	try {
		const response = await fetch(
			`${API_URL}/authentification/check-username?username=${text}`,
			{
				method: "GET",
				headers: {
					"x-api-key": API_KEY,
					// Authorization: `Bearer ${responseToken}`,
				},
			},
		);

		const data = await response.json();

		return { status: response.status, data };
	} catch (error) {}
}
