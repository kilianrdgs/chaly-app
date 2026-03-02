import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
	FlatList,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import getMyInfos from "../../api/users/getUser.api";
import colors from "../../assets/colors";
import { useScrollLogic } from "../../hooks/useScrollLogic";
import useUserStore, { userStore } from "../../store/user.store";
import { useProfileCuitesStore } from "../../store/userCuites.store";
import { getGradientByName } from "../../utils/backgroundProfile";
import MyIcon from "../icons/MyIcon";
import DescriptionProfile from "./DescriptionProfile";
import ModifyProfile from "./ModifyProfile";
import Publications from "./Publications";
import Statistics from "./Statistics";
import UserAvatar from "./UserAvatar";

export default function ProfileComponent() {
	const { user } = useUserStore();
	const colorsBg = getGradientByName(user?.backgroundName, "black");
	const { loading, loadMoreCuites, refreshCuites } = useScrollLogic(
		user?.username || "",
		useProfileCuitesStore(),
		9,
		"profile",
	);

	const cuites = useProfileCuitesStore((state) => state.cuites);

	return (
		<LinearGradient
			colors={colorsBg}
			start={{ x: 0, y: 0 }}
			end={{ x: 1, y: 1 }}
			style={{ flex: 1 }}
			locations={[0, 0.65, 1]}
		>
			<FlatList
				ListHeaderComponent={() => (
					<View className="gap-1 px-5 mt-5">
						<ModifyProfile />
						<UserAvatar isOwnProfile={true} />
						<View
							style={{ flexDirection: "row" }}
							className="items-center justify-center"
						>
							<Text className="text-[26px] text-center font-black text-white">
								{user?.username?.toUpperCase()}
							</Text>
							{user?.certified === true && (
								<MyIcon name="certified" size={30} color={colors.secondary} />
							)}
						</View>
						<DescriptionProfile />
						<Statistics isOwnProfile={true} />
					</View>
				)}
				data={cuites}
				renderItem={({ item }) => <Publications item={item} />}
				numColumns={3}
				keyExtractor={(item) => String(item.Id)}
				onEndReachedThreshold={0.2}
				onEndReached={loadMoreCuites}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={async () => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
							refreshCuites();
							const responseUser = await getMyInfos();
							userStore.setUser({
								username: responseUser.user.Pseudo,
								xpTotal: responseUser.user.XpTotal.xpTotal,
								isAuthenticated: true,
								currentLevel: responseUser.user.XpTotal.currentLevel,
								percentageToNextLevel:
									responseUser.user.XpTotal.percentageToNextLevel,
								totalCuites: responseUser.user.stats.totalCuites,
								streakDays: responseUser.user.stats.streakDays,
								moderator: responseUser.user.Moderator,
								certified: responseUser.user.IsCertified,
								description: responseUser.user.Description || "",
								backgroundName: responseUser.user.BackgroundName || null,
							});
						}}
						tintColor="#fff"
					/>
				}
				style={{ flex: 1, backgroundColor: "transparent" }}
				contentContainerStyle={{ paddingBottom: 110 }}
			/>
		</LinearGradient>
	);
}
