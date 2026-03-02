import { useRouter } from "expo-router";
import {
	Button,
	Linking,
	Pressable,
	ScrollView,
	Text,
	View,
} from "react-native";

export default function AuthorisationInfoScreen() {
	const router = useRouter();

	return (
		<ScrollView>
			<Text className="mb-4 text-2xl font-bold text-center text-white">
				Autorisations utilisées
			</Text>

			<View className="gap-4 mb-6 space-y-4">
				<View className="w-[100%] mb-4">
					<Text className="text-lg font-semibold text-center text-white">
						📷 Caméra
					</Text>
					<Text className="text-center text-neutral-400">
						Utilisée pour prendre des photos en temps réel dans l'app.
					</Text>
				</View>

				<View className="w-[100%] mb-4">
					<Text className="text-lg font-semibold text-center text-white">
						🖼️ Galerie
					</Text>
					<Text className="text-center text-neutral-400">
						Permet de générer une photo même après coup (si autorisé).
					</Text>
				</View>

				<View className="w-[100%] mb-4">
					<Text className="text-lg font-semibold text-center text-white">
						📍 Localisation
					</Text>
					<Text className="text-center text-neutral-400">
						Elle sert à associer un lieu à ta photo.
					</Text>
				</View>

				<View className="w-[100%] mb-4">
					<Text className="text-lg font-semibold text-center text-white">
						🔔 Notifications
					</Text>
					<Text className="text-center text-neutral-400">
						Pour t'envoyer des rappels ou te prévenir quand un ami a réagi.
					</Text>
				</View>
			</View>

			<Button
				title="Ouvrir les réglages"
				onPress={() => Linking.openSettings()}
			/>
		</ScrollView>
	);
}
