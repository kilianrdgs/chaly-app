import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, FlatList, RefreshControl, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import getChallengesList from "../api/challenges/getChallengesList.api";
import colors from "../assets/colors";
import Header from "../components/commons/header/Header";

interface Challenge {
	Id: number;
	Title: string;
	Description: string;
	Xp: number;
}

export default function Challenge() {
	const [items, setItems] = useState<Challenge[]>([]);
	const [refreshing, setRefreshing] = useState(false);

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

	const load = useCallback(async () => {
		try {
			const data = await getChallengesList();
			if (!data || data.success === false) {
				console.error(data?.message || "Erreur de récupération des défis");
				return;
			}
			setItems(data);
		} catch (err) {
			console.error("Erreur getChallengesList:", err);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const onRefresh = async () => {
		setRefreshing(true);
		await load();
		setRefreshing(false);
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[{ flex: 1 }, animatedStyle]}>
					<Header title="Défis" isSettingPage />
					<FlatList
						data={items}
						keyExtractor={(item) => String(item.Id)}
						contentContainerStyle={{
							paddingHorizontal: 16,
							paddingTop: 12,
							paddingBottom: 24,
							gap: 8,
						}}
						renderItem={({ item }) => (
							<View className="p-3 border border-gray-900 rounded-xl bg-gray-950">
								<View className="flex-row items-center justify-between mb-1">
									<Text
										className="flex-1 pr-2 text-white text-s font-montserrat"
										numberOfLines={1}
									>
										{item.Title}
									</Text>

									<View className="px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/30">
										<Text className="text-[10px] text-pink-400 font-poppins">
											+{item.Xp} XP
										</Text>
									</View>
								</View>

								<Text
									className="mb-2 text-[12px] text-white"
									numberOfLines={2}
									ellipsizeMode="tail"
								>
									{item.Description}
								</Text>
							</View>
						)}
						showsVerticalScrollIndicator={false}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={() => {
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
									onRefresh();
								}}
								tintColor="#fff"
							/>
						}
					/>
					<View>
						<Text
							style={{ color: colors.gray, textAlign: "center", margin: 20 }}
						>
							✨ Hey ! Pour l’instant, ces défis sont là juste pour t’inspirer
							et te donner des idées fun 📸. La possibilité de les réaliser et
							de gagner l’XP associé arrive très bientôt… reste connecté ! 🚀
						</Text>
					</View>
				</Animated.View>
			</GestureDetector>
		</SafeAreaView>
	);
}
