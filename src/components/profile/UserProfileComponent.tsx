import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import getInformationsUser from "../../api/users/getInformationsUser.api";
import colors from "../../assets/colors";
import { useScrollLogic } from "../../hooks/useScrollLogic";
import { usePublicProfileStore } from "../../store/publicProfile.store";
import useUserStore from "../../store/user.store";
import { getGradientByName } from "../../utils/backgroundProfile";
import Header from "../commons/header/Header";
import MyIcon from "../icons/MyIcon";
import Statistics from "./Statistics";
import UserAvatar from "./UserAvatar";
import PublicProfilePublications from "./UserProfilePublications";

export default function UserProfileComponent() {
	const { user } = useUserStore();
	const store = usePublicProfileStore();
	const {
		username,
		cuites,
		certified,
		description,
		backgroundName,
		setCertified,
		setDescription,
		setStreakDays,
		setTotalCuites,
		setBackgroundName,
	} = store;

	const { loading, loadMoreCuites, refreshCuites } = useScrollLogic(
		username ?? "",
		store,
		9,
		"profile",
	);

	useEffect(() => {
		if (username) {
			store.reset();
			refreshCuites();
		}
	}, [username, store.reset, refreshCuites]);

	const colorsBg = getGradientByName(backgroundName, "black");

	return (
		<LinearGradient
			colors={colorsBg}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			locations={[0, 0.65, 1]}
			style={{ flex: 1 }}
		>
			<Header title={username?.toUpperCase() ?? "PROFIL"} isSettingPage />

			<FlatList
				ListHeaderComponent={() => (
					<View className="gap-1 px-4 mt-5">
						<UserAvatar isOwnProfile={false} />
						<View
							style={{ flexDirection: "row" }}
							className="items-center justify-center"
						>
							<Text className="text-[26px] text-center font-black text-white">
								{username?.toUpperCase()}
							</Text>
							{certified === true && (
								<MyIcon name="certified" size={30} color={colors.secondary} />
							)}
						</View>
						<Text className="justify-center mt-2 font-semibold text-center text-white font-poppins">
							{description || "Toujours en quête de vibes 🔮"}
						</Text>
						<Statistics isOwnProfile={false} />
					</View>
				)}
				data={cuites}
				renderItem={({ item }) => <PublicProfilePublications item={item} />}
				keyExtractor={(item) => item.Id.toString()}
				numColumns={3}
				onEndReachedThreshold={0.2}
				onEndReached={loadMoreCuites}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={async () => {
							refreshCuites();
							const result = await getInformationsUser(username ?? "");
							setCertified(result.user?.IsCertified ?? false);
							setDescription(result.user?.Description ?? null);
							setStreakDays(result.user?.stats.streakDays ?? 0);
							setTotalCuites(result.user?.stats.totalCuites ?? 0);
							setBackgroundName?.(result.user?.BackgroundName ?? null);
						}}
						tintColor="#fff"
					/>
				}
				contentContainerStyle={{ paddingBottom: 40 }}
			/>
		</LinearGradient>
	);
}
