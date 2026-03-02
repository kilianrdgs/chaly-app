import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import {
	Alert,
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import deleteCuite from "../../api/cuites/deleteCuite.api";
import getCuitesList from "../../api/cuites/getCuitesList.api";
import useNewCuitesStore from "../../store/addCuite";
import { useCuitesScrollStore } from "../../store/cuites.store";
import useUserStore from "../../store/user.store";

type Props = {
	isMyPost: boolean;
	cuiteId: number;
	urlPicture: string;
	authorPseudo: string;
	defaultTitle: string;
	defaultDescription: string;
};

export default function PostOptionsMenu({
	isMyPost,
	cuiteId,
	urlPicture,
}: Props) {
	const [visible, setVisible] = useState(false);
	const moderator = useUserStore((state) => state.user?.moderator);
	const { user } = useUserStore();

	const shareRemoteImage = async () => {
		console.log(urlPicture);
		try {
			if (!urlPicture) {
				console.log("Pas d'URL");
				return;
			}

			const fileName =
				urlPicture.split("/").pop()?.split("?")[0] || "image.jpg";
			const localPath = FileSystem.documentDirectory + fileName;

			const download = await FileSystem.downloadAsync(urlPicture, localPath);

			const info = await FileSystem.getInfoAsync(download.uri);
			if (!info.exists || info.size === 0) {
				Alert.alert("Erreur", "L'image n'a pas été téléchargée correctement.");
				return;
			}

			await new Promise((resolve) => setTimeout(resolve, 100));

			if (!(await Sharing.isAvailableAsync())) {
				Alert.alert(
					"Partage non dispo",
					"Le partage n’est pas supporté sur cet appareil.",
				);
				return;
			}

			await Sharing.shareAsync(download.uri, {
				mimeType: "image/jpeg",
				dialogTitle: "Partager ton souvenir Chaly 📸",
			});
		} catch (error) {
			console.error("Erreur de partage :", error);
			Alert.alert("Erreur", "Impossible de partager l’image.");
		}
	};

	const handleDelete = () => {
		Alert.alert(
			"Suppresion",
			"Tu veux vraiment effacer ce souvenir ? 😒",
			[
				{ text: "Annuler", style: "cancel" },
				{
					text: "Oui",
					style: "destructive",
					onPress: async () => {
						if (!cuiteId) return;
						const response = await deleteCuite(cuiteId);
						if (response === true) {
							const { setCuites, setLoading, reset } =
								useCuitesScrollStore.getState();
							setLoading(true);
							reset();
							if (!user?.username) return;
							const result = await getCuitesList(
								6,
								null,
								"scroll",
								user?.username,
							);
							if (result) {
								setCuites(result.cuites, result.nextCursor);
							}
							setLoading(false);
						}
					},
				},
			],
			{ cancelable: true },
		);
	};

	return (
		<View style={{ position: "absolute", right: 10, top: 25 }}>
			<TouchableOpacity onPress={() => setVisible(true)}>
				<Ionicons name="ellipsis-vertical" size={25} color="white" />
			</TouchableOpacity>

			<Modal transparent animationType="fade" visible={visible}>
				<Pressable
					className="flex-1 bg-black/50"
					onPress={() => setVisible(false)}
				>
					<View className="absolute p-2 space-y-2 top-32 right-4 w-52 bg-zinc-900 rounded-xl">
						<TouchableOpacity
							className="flex-row items-center p-2 space-x-2 rounded-md bg-zinc-800"
							onPress={() => {
								setVisible(false);
								router.push({ pathname: "/map", params: { id: cuiteId } });
							}}
						>
							<Ionicons name="map-outline" size={18} color="white" />
							<Text className="mx-2 text-lg font-medium text-white">
								Voir sur la carte
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-row items-center p-2 space-x-2 rounded-md bg-zinc-800"
							onPress={() => {
								setVisible(false);
								shareRemoteImage();
							}}
						>
							<Ionicons name="share-social-outline" size={18} color="white" />
							<Text className="mx-2 font-medium text-white">Partager</Text>
						</TouchableOpacity>
						{(isMyPost || moderator) && (
							<TouchableOpacity
								className="flex-row items-center p-2 space-x-2 text-lg rounded-md bg-zinc-800"
								onPress={() => {
									setVisible(false);
									handleDelete();
								}}
							>
								<Ionicons name="trash-outline" size={18} color="red" />
								<Text className="mx-2 text-lg font-medium text-red-400">
									Supprimer
								</Text>
							</TouchableOpacity>
						)}
					</View>
				</Pressable>
			</Modal>
		</View>
	);
}
