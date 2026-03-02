import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";
import { Animated, Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ping from "../api/auth/ping.api";
import verifyToken from "../api/auth/verifyToken.api";
import getMyInfos from "../api/users/getUser.api";

import { useNotificationStore } from "../store/postId.store";
import { userStore } from "../store/user.store";
import { downloadProfilePicture } from "../utils/downloadProfilePicture";

export default function IndexPage() {
	const insets = useSafeAreaInsets();
	const [message, setMessage] = useState("");

	const setPostId = useNotificationStore((state) => state.setPostId);

	// Initialisation du flow complet
	const initialize = useCallback(async () => {
		// 1. Vérification si notification cliquée au cold start
		const notifResponse =
			await Notifications.getLastNotificationResponseAsync();
		const postIdFromNotif =
			notifResponse?.notification?.request?.content?.data?.postId;

		// 2. Ping serveur
		const isPingOk = await ping();
		if (!isPingOk) {
			setMessage("Le serveur est KO, mais il revient vite... 😘");
			return;
		}

		// 3. Authentification
		const tokenResponse = await verifyToken();
		if (tokenResponse.success !== 200) {
			router.replace("/loginPage");
			return;
		}

		// 4. Profil utilisateur
		const responseUser = await getMyInfos();
		console.log("🛠️ getMyInfos response:", responseUser);
		if (!responseUser?.user?.IsVerified) {
			router.replace("/createUsername");
			return;
		}

		userStore.setUser({
			username: responseUser.user.Pseudo,
			xpTotal: responseUser.user.XpTotal.xpTotal,
			isAuthenticated: true,
			currentLevel: responseUser.user.XpTotal.currentLevel,
			percentageToNextLevel: responseUser.user.XpTotal.percentageToNextLevel,
			totalCuites: responseUser.user.stats.totalCuites,
			streakDays: responseUser.user.stats.streakDays,
			moderator: responseUser.user.Moderator,
			certified: responseUser.user.IsCertified,
			description: responseUser.user.Description || "",
			backgroundName: responseUser.user.BackgroundName || null,
		});
		await downloadProfilePicture(responseUser.user.PhotoUrl);

		router.replace("/(tabs)");
	}, []);

	// Lancement à l'affichage
	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<View
			className="items-center justify-center flex-1 bg-black"
			style={{ paddingTop: insets.top }}
		>
			<Image
				source={require("../assets/images/logo2-nobg.png")}
				className="w-[100px] h-[100px]"
				style={{ resizeMode: "contain" }}
			/>

			<Text style={{ color: "white", marginTop: 20 }}>{message}</Text>
		</View>
	);
}
