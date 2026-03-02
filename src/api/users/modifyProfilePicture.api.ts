import Constants from "expo-constants";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function modifyProfilePicture(profilePictureUri: string) {
	const responseToken = await getToken();

	if (!responseToken) {
		return { success: false, message: "Aucun Token, déconnexion" };
	}

	const formData = new FormData();

	const uriParts = profilePictureUri.split(".");
	const fileExtension = uriParts[uriParts.length - 1].toLowerCase();

	let mimeType = "image/jpeg";
	if (fileExtension === "png") mimeType = "image/png";
	else if (fileExtension === "jpg" || fileExtension === "jpeg")
		mimeType = "image/jpeg";

	formData.append("media", {
		uri: profilePictureUri,
		name: `photo.${fileExtension}`,
		type: mimeType,
	} as unknown as Blob);

	try {
		const response = await fetch(`${API_URL}/users/photo`, {
			method: "POST",
			headers: {
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
			},
			body: formData,
		});

		if (!response.ok) {
			console.error("Erreur API :", response.status, await response.text());
			return "error";
		}

		if (response.status === 200) {
			return true;
		}
	} catch (error) {
		console.error("Erreur réseau :", error);
		return "network-error";
	}
}
