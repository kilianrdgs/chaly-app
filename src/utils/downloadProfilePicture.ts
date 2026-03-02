import * as FileSystem from "expo-file-system";

export const PROFILE_PIC_PATH = `${FileSystem.documentDirectory}profile.jpg${Date.now()}`;

export const downloadProfilePicture = async (
	remoteUrl: string,
): Promise<string | null> => {
	try {
		await FileSystem.downloadAsync(remoteUrl, PROFILE_PIC_PATH);
		return PROFILE_PIC_PATH;
	} catch (error) {
		console.error(
			"Erreur lors du téléchargement de la photo de profil :",
			error,
		);
		return null;
	}
};
