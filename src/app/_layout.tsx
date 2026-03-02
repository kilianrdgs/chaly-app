import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import { ToastProvider } from "../components/commons/toast/Toast";
import { initMixpanel, trackConnectionWithAcount } from "../utils/mixpanel";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CommonModal from "../components/commons/modal/CommonModal";
import { usePushNotifications } from "../hooks/usePushNotification";

export default function RootLayout() {
	const [loaded, error] = useFonts({
		"Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
		"Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) return null;

	return <LayoutContent />;
}

function LayoutContent() {
	useEffect(() => {
		initialize();
	}, []);

	const initialize = async () => {
		await initMixpanel();
		trackConnectionWithAcount();
	};

	usePushNotifications(() => {}); // PERMISSION POUR NOTIFICATIONS

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View className="flex-1 bg-black">
				<ToastProvider>
					<Stack>
						<Stack.Screen
							name="index"
							options={{ headerShown: false, animation: "fade" }}
						/>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false, animation: "fade" }}
						/>
						<Stack.Screen
							name="map"
							options={{
								headerShown: false,
								presentation: "modal",
								animation: "slide_from_bottom",
							}}
						/>
						<Stack.Screen
							name="scroll"
							options={{ headerShown: false, animation: "fade" }}
						/>
						<Stack.Screen
							name="profile"
							options={{ headerShown: false, animation: "fade" }}
						/>
						<Stack.Screen name="settings" options={{ headerShown: false }} />
						<Stack.Screen
							name="locationSelection"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="takePhotoScreen"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="friends" options={{ headerShown: false }} />
						<Stack.Screen name="challenge" options={{ headerShown: false }} />
						<Stack.Screen
							name="photoViewer"
							options={{
								animation: "slide_from_right",
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="profilePublic"
							options={{
								animation: "slide_from_right",
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="photoPreviewScreen"
							options={{
								headerShown: false,
								presentation: "modal",
								animation: "fade_from_bottom",
							}}
						/>
						<Stack.Screen
							name="infoScreen"
							options={{
								headerShown: false,
								presentation: "modal",
								animation: "slide_from_bottom",
							}}
						/>
						<Stack.Screen
							name="loginPage"
							options={{
								headerShown: false,
								presentation: "fullScreenModal",
								animation: "fade",
								gestureEnabled: false,
							}}
						/>
						<Stack.Screen
							name="createUsername"
							options={{
								headerShown: false,
								presentation: "fullScreenModal",
								animation: "fade",
								gestureEnabled: false,
							}}
						/>
					</Stack>
				</ToastProvider>
				<CommonModal />
			</View>
		</GestureHandlerRootView>
	);
}
