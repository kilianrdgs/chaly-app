import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import type { NewCuite } from "../../models/cuites/Cuite.model";
import { trackCuiteCreated } from "../../utils/mixpanel";
import { getToken } from "../../utils/secureToken";

const API_URL = Constants.expoConfig?.extra?.apiUrl;
const API_KEY = Constants.expoConfig?.extra?.apiKey;

export default async function createCuite(cuite: NewCuite) {
	const responseToken = await getToken();

	if (!cuite.location || !cuite.date || !cuite.title || !cuite.media) {
		return "warning";
	}

	const data = {
		Emplacement: {
			Latitude: cuite.location.latitude.toString(),
			Longitude: cuite.location.longitude.toString(),
			Adresse: cuite.location.address,
		},
		Titre: cuite.title,
		Description: cuite.description,
		CuiteDate: new Date(cuite.date).toISOString(),
		Id_Confidentiality: cuite.confidentiality ?? 1,
	};

	try {
		const uploadUrl = `${API_URL}/cuites`;

		const formData = new FormData();
		formData.append("data", JSON.stringify(data));

		const uriParts = cuite.media.uri.split(".");
		const fileExtension = uriParts[uriParts.length - 1].toLowerCase();
		let mimeType = "image/jpeg";
		if (fileExtension === "png") mimeType = "image/png";

		formData.append("media", {
			uri: cuite.media.uri,
			name: `photo.${fileExtension}`,
			type: mimeType,
		} as unknown as Blob);

		const response = await FileSystem.uploadAsync(uploadUrl, cuite.media.uri, {
			httpMethod: "POST",
			headers: {
				"x-api-key": API_KEY,
				Authorization: `Bearer ${responseToken}`,
				"Content-Type": "multipart/form-data",
			},
			uploadType: FileSystem.FileSystemUploadType.MULTIPART,
			fieldName: "media",
			parameters: {
				data: JSON.stringify(data),
			},
		});

		if (response.status !== 201) {
			console.error("Erreur API :", response.status, response.body);
			return "error";
		}

		trackCuiteCreated();
		return true;
	} catch (err) {
		console.error("Erreur réseau :", err);
		return "network-error";
	}
}
