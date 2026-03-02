import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	Dimensions,
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import getClassement from "../api/users/classement.api";
import Header from "../components/commons/header/Header";
import { usePublicProfileStore } from "../store/publicProfile.store";
import useUserStore from "../store/user.store";

import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import getInformationsUser from "../api/users/getInformationsUser.api";
import colors from "../assets/colors";
import MyIcon from "../components/icons/MyIcon";

const SCREEN_WIDTH = Dimensions.get("window").width;

type User = {
	id: number;
	pseudo: string;
	photoUrl: string;
	IsCertified: boolean;
	cuitesCount: number;
};

export default function Friends() {
	const [users, setUsers] = useState<User[]>([]);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const [isEndReached, setIsEndReached] = useState(false);
	const isFetchingRef = useRef(false);
	const {
		setUsername,
		setUserPicture,
		setCertified,
		setDescription,
		setStreakDays,
		setTotalCuites,
		setBackgroundName,
	} = usePublicProfileStore();
	const currentUser = useUserStore((state) => state.user);

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

	const fetchUsers = useCallback(
		async (limit = 20, cursor: string | null = null, isRefresh = false) => {
			if (isFetchingRef.current) return;
			isFetchingRef.current = true;
			isRefresh ? setRefreshing(true) : setLoading(true);

			try {
				const response = await getClassement(limit, cursor);
				if (response.success) {
					const fetchedUsers = response.users.users ?? [];
					const newCursor = response.users.nextCursor ?? null;

					if (isRefresh) {
						setUsers(fetchedUsers);
						setIsEndReached(newCursor === null);
					} else {
						setUsers((prev) => [...prev, ...fetchedUsers]);
						if (fetchedUsers.length === 0 || newCursor === null) {
							setIsEndReached(true);
						}
					}

					setNextCursor(newCursor);
				} else {
					console.warn("Erreur dans la réponse du backend");
				}
			} catch (error) {
				console.error("Erreur lors du fetch du classement :", error);
			} finally {
				isFetchingRef.current = false;
				setLoading(false);
				setRefreshing(false);
			}
		},
		[],
	);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const onRefresh = () => {
		setIsEndReached(false);
		fetchUsers(20, null, true);
	};

	const onLoadMore = () => {
		if (!loading && !isEndReached && nextCursor) {
			fetchUsers(20, nextCursor);
		}
	};

	const viewProfile = async (UserPseudo: string, UserPicture: string) => {
		if (!UserPseudo) return;

		const result = await getInformationsUser(UserPseudo);
		if (currentUser?.username === UserPseudo) {
			router.push("/(tabs)/profile");
			return;
		}

		router.push("/profilePublic");
		setUsername(UserPseudo);
		setCertified(result.user?.IsCertified ?? false);
		setDescription(result.user?.Description ?? null);
		setStreakDays(result.user?.stats.streakDays ?? 0);
		setTotalCuites(result.user?.stats.totalCuites ?? 0);
		setUserPicture(UserPicture ?? null);
		setBackgroundName(result.user?.BackgroundName ?? null);
	};

	const renderItem = ({ item, index }: { item: User; index: number }) => {
		const medals = ["🥇", "🥈", "🥉"];
		const rank = index + 1;
		const isTop3 = rank <= 3;

		return (
			<TouchableOpacity
				activeOpacity={0.7}
				className={`flex-row items-center justify-between py-4 ${
					isTop3 ? "bg-gray-900 rounded-xl px-2" : ""
				}`}
				onPress={() => viewProfile(item.pseudo, item.photoUrl)}
			>
				<View className="flex-row items-center flex-1 gap-3">
					<Text className="w-10 text-lg font-bold text-center text-white shrink-0">
						{isTop3 ? medals[index] : `${rank}`}
					</Text>

					<Image
						source={
							item.photoUrl
								? { uri: item.photoUrl }
								: require("../assets/images/avatar.webp")
						}
						className="w-12 h-12 rounded-full"
					/>
					<View className="flex-row items-center gap-1">
						<Text
							className="text-base text-white font-montserrat max-w-[160px]"
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{item.pseudo?.toUpperCase() || "UTILISATEUR"}
						</Text>
						{item.IsCertified && (
							<MyIcon name="certified" size={20} color={colors.secondary} />
						)}
					</View>
				</View>

				<Text
					className={`text-sm font-poppins ${
						item.cuitesCount === 0 ? "text-red-500" : "text-white"
					}`}
				>
					{item.cuitesCount} post{item.cuitesCount !== 1 ? "s" : ""}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[{ flex: 1 }, animatedStyle]}>
					<Header title="Classement" isSettingPage />
					<FlatList
						contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
						data={users}
						keyExtractor={(item, index) =>
							item?.id?.toString?.() ?? `fallback-${index}`
						}
						ItemSeparatorComponent={() => (
							<View className="h-[1px] bg-gray-800" />
						)}
						renderItem={renderItem}
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
						onEndReached={onLoadMore}
						onEndReachedThreshold={0.3}
						ListFooterComponent={
							loading && !refreshing ? (
								<View className="py-4">
									<Text className="text-sm text-center text-white">
										Chargement...
									</Text>
								</View>
							) : isEndReached ? (
								<View className="py-4">
									<Text className="text-sm text-center text-white text-gray-400">
										Fin du classement 🎉
									</Text>
								</View>
							) : null
						}
					/>
				</Animated.View>
			</GestureDetector>
		</SafeAreaView>
	);
}
