import * as FileSystem from "expo-file-system";
import { Image } from "react-native-compressor";

export const compressImage = async (
	uri: string,
	post?: boolean,
): Promise<string> => {
	try {
		const originalInfo = await FileSystem.getInfoAsync(uri);
		if (originalInfo.exists && "size" in originalInfo) {
			console.log(
				`📷 Image d'origine : ${Math.round(originalInfo.size / 1024)} Ko`,
			);
		} else {
			console.warn("Image d'origine introuvable.");
		}

		const result = await Image.compress(uri, {
			compressionMethod: "auto",
			maxWidth: post ? 1440 : 480,
			quality: post ? 1 : 0.5,
			output: "jpg",
		});

		const compressedInfo = await FileSystem.getInfoAsync(result);
		if (compressedInfo.exists && "size" in compressedInfo) {
			console.log(
				`📦 Image compressée : ${Math.round(compressedInfo.size / 1024)} Ko`,
			);
		} else {
			console.warn("Image compressée introuvable.");
		}

		return result;
	} catch (err) {
		console.error("❌ Erreur compression image :", err);
		return uri;
	}
};
