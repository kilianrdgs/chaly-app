import Constants from "expo-constants";

const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapboxApiKey;

export default async function fetchLocation(
	longitude: number,
	latitude: number,
): Promise<string | null> {
	try {
		const response = await fetch(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_API_KEY}`,
		);
		const data = await response.json();
		if (data.features && data.features.length > 0) {
			const responseAddress = data.features[2].place_name
				? data.features[2].place_name
				: data.features[0].place_name;
			console.log("Adresse trouvée :", responseAddress);
			return responseAddress;
		}
		console.log("Aucune adresse trouvée pour ces coordonnées.");
		return null;
	} catch (error) {
		console.error("Erreur lors de la récupération de l'adresse :", error);
		return null;
	}
}
