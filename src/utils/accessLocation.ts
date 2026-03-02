import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export async function getUserLocation(): Promise<[number, number]> {
	try {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			Alert.alert(
				"Permission refusée",
				"L'accès à la localisation est nécessaire. Vous pouvez l'activer dans les réglages.",
				[
					{
						text: "Ouvrir les réglages",
						onPress: () => Linking.openSettings(),
					},
				],
			);
			return [2.3522, 48.8566];
		}

		const { coords } = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.Balanced,
		});

		return [coords.longitude, coords.latitude];
	} catch (err) {
		console.error("Erreur lors de la récupération de la localisation :", err);
		return [2.3522, 48.8566];
	}
}
