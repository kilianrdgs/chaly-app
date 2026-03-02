import Mapbox, {
	MapView,
	Camera,
	UserLocation,
	MarkerView,
} from "@rnmapbox/maps";
import Constants from "expo-constants";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import getCuites from "../../api/cuites/readCuite.api";
import colors from "../../assets/colors";
import { getUserLocation } from "../../utils/accessLocation";

const MAPBOX_API_KEY = Constants.expoConfig?.extra?.mapboxApiKey;

Mapbox.setAccessToken(MAPBOX_API_KEY);

type CuiteMedia = {
	Photo: string;
	Emplacement: {
		Latitude: number;
		Longitude: number;
	};
};

export default function ViewMap() {
	const [userLocation, setUserLocation] = useState<[number, number] | null>(
		null,
	);
	const [media, setMedia] = useState<CuiteMedia | null>(null);
	const { id } = useLocalSearchParams();

	const fetchCuites = useCallback(async () => {
		const response = await getCuites(id);
		console.log(response);
		const parsedMedia: CuiteMedia = {
			...response,
			Emplacement: {
				Latitude: Number.parseFloat(response.Emplacement.Latitude),
				Longitude: Number.parseFloat(response.Emplacement.Longitude),
			},
		};

		setMedia(parsedMedia);
	}, [id]);

	useEffect(() => {
		Mapbox.setTelemetryEnabled(false);
		fetchCuites();
		const fetchLocation = async () => {
			const location = await getUserLocation();
			setUserLocation(location);
		};

		fetchLocation();
	}, [fetchCuites]);

	const longitude = userLocation?.[0] ?? 2.3522;
	const latitude = userLocation?.[1] ?? 48.8566;

	return (
		<MapView
			style={[styles.container]}
			styleURL="mapbox://styles/mapbox/dark-v11"
			compassViewMargins={{ x: -100, y: -100 }}
			scaleBarEnabled={false}
			attributionEnabled={false}
		>
			<Camera
				centerCoordinate={
					media?.Emplacement.Longitude && media.Emplacement.Latitude
						? [media.Emplacement.Longitude, media.Emplacement.Latitude]
						: [longitude, latitude]
				}
				zoomLevel={12}
				animationDuration={0}
			/>

			<UserLocation visible={true} />

			{media?.Emplacement.Longitude && media.Emplacement.Latitude && (
				<MarkerView
					coordinate={[media.Emplacement.Longitude, media.Emplacement.Latitude]}
				>
					<View>
						<Image
							source={
								media?.Photo
									? { uri: media.Photo }
									: require("../../assets/images/avatar.webp")
							}
							style={styles.image}
						/>
					</View>
				</MarkerView>
			)}
		</MapView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: "100%",
	},
	markerContainer: {
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.secondary,
		borderColor: colors.black,
		borderWidth: 2,
		borderRadius: 20,
	},
	image: {
		height: 100,
		width: 60,
		borderRadius: 10,
	},
});
