import { useRouter } from "expo-router";
import {
	Alert,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import deleteAcount from "../api/users/deleteAcount.api";
import Header from "../components/commons/header/Header";
import { useToast } from "../components/commons/toast/Toast";
import SettingBtn from "../components/settings/SettingBtn";
import {
	type SettingsGroup,
	type SettingsItem,
	settingsData,
} from "../components/settings/settings";
import { authStore } from "../store/auth.store";
import { userStore } from "../store/user.store";

import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";

export default function Settings() {
	const router = useRouter();
	const { openToast } = useToast();

	const SCREEN_WIDTH = Dimensions.get("window").width;
	const translateX = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			if (e.translationX > 0) {
				translateX.value = e.translationX;
			}
		})
		.onEnd(() => {
			if (translateX.value > SCREEN_WIDTH * 0.2) {
				runOnJS(router.back)();
			} else {
				translateX.value = withSpring(0);
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const handlePress = () => {
		Alert.alert(
			"Supprimer mon compte",
			"Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
			[
				{
					text: "Annuler",
					style: "cancel",
				},
				{
					text: "Confirmer",
					style: "destructive",
					onPress: async () => {
						try {
							const response = await deleteAcount();
							if (response?.success === true) {
								userStore.clearUser();
								authStore.reset();
								router.replace("/loginPage");
								openToast("info", "Tu vas nous manquer 🥺");
							}
						} catch (error) {
							console.error("Erreur lors de la suppression du compte :", error);
						}
					},
				},
			],
		);
	};

	return (
		<View className="flex-1 bg-black">
			<SafeAreaView className="flex-1 bg-black">
				<GestureDetector gesture={panGesture}>
					<Animated.View style={[{ flex: 1 }, animatedStyle]}>
						<Header title={settingsData.title} isSettingPage={true} />
						<ScrollView
							className="flex-1 bg-black px-[15px]"
							showsVerticalScrollIndicator={false}
						>
							<View className="mt-[15px] flex flex-col gap-y-10">
								{settingsData.groups.map((group: SettingsGroup) => (
									<View key={group.groupName} className="flex flex-col gap-y-2">
										<Text className="text-white text-[16px] font-black text-center mb-[5px] px-[5px]">
											{group.groupName}
										</Text>
										{group.items.map((item: SettingsItem) => (
											<SettingBtn
												key={item.name}
												optionBtn={item.icon}
												textBtn={item.name}
												action={item.content.action}
											/>
										))}
									</View>
								))}
							</View>
							<View>
								<TouchableOpacity onPress={handlePress}>
									<Text
										style={{ color: "red", textAlign: "center", marginTop: 40 }}
									>
										supprimer mon compte
									</Text>
								</TouchableOpacity>
							</View>
						</ScrollView>
					</Animated.View>
				</GestureDetector>
			</SafeAreaView>
		</View>
	);
}
