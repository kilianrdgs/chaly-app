import Constants from "expo-constants";
import normalizePhone from "../../utils/normalizePhone";
import { storeToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function verifyCode(
	phone: string,
	verificationCode: string,
) {
	const normalizedNumber = await normalizePhone(phone);

	const response = await fetch(`${API_URL}/authentification/verify-code`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-api-key": API_KEY,
		},
		body: JSON.stringify({ phone: normalizedNumber, code: verificationCode }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || "Erreur serveur");
	}

	const data = await response.json();
	if (response.status === 201) {
		await storeToken(data);
		return { success: true, status: response.status };
	}

	if (response.status === 200) {
		await storeToken(data.Token);
		return { success: true, status: response.status };
	}

	return { success: false, status: response.status };
}
