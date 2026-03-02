import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { trackIaRequest } from "../../utils/mixpanel";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function verifyMedia(
	photoUri: string,
	replyTo?: string,
	lastTitle?: string,
	lastDescription?: string,
) {
	const personality =
		(await AsyncStorage.getItem("selectedPersonality")) || "default";

	const fileInfo = await FileSystem.getInfoAsync(photoUri);
	if (!fileInfo.exists) {
		throw new Error("Le fichier image n'existe pas !");
	}

	trackIaRequest({
		from: "photoPreviewScreen",
		personality,
	});

	const uploadUrl = `${API_URL}/pictures/analyse?personality=${personality}`;

	const response = await FileSystem.uploadAsync(uploadUrl, photoUri, {
		httpMethod: "POST",
		headers: {
			"x-api-key": API_KEY,
			"Content-Type": "multipart/form-data",
		},
		uploadType: FileSystem.FileSystemUploadType.MULTIPART,
		fieldName: "media",
		parameters: {
			replyTo: replyTo ?? "",
			lastTitle: lastTitle ?? "",
			lastDescription: lastDescription ?? "",
		},
	});

	if (response.status !== 200) {
		console.error("Erreur serveur IA:", response.body);
		throw new Error("Erreur lors de l'analyse de l'image");
	}

	const data = JSON.parse(response.body);
	return data;
}
