import { useCallback, useEffect, useState } from "react";
import {
	FlatList,
	Image,
	RefreshControl,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import { router } from "expo-router";
import getLikes from "../../../../api/cuites/like/getLikes.api";
import getInformationsUser from "../../../../api/users/getInformationsUser.api";
import colors from "../../../../assets/colors";
import { useModalStore } from "../../../../store/modal.store";
import { usePublicProfileStore } from "../../../../store/publicProfile.store";
import useUserStore from "../../../../store/user.store";

type LikeUser = {
	Id: number;
	Pseudo: string;
	UserPicture: string | null;
};

export default function LikeModal() {
	const { postId, hideModal } = useModalStore();
	const [likes, setLikes] = useState<LikeUser[]>([]);
	const [count, setCount] = useState(0);
	const [refreshing, setRefreshing] = useState(false);

	const currentUser = useUserStore((state) => state.user);

	const {
		setUsername,
		setUserPicture,
		setCertified,
		setDescription,
		setStreakDays,
		setTotalCuites,
		setBackgroundName,
	} = usePublicProfileStore();

	const fetchLikes = useCallback(async () => {
		if (!postId) return;
		try {
			const response = await getLikes(postId);
			setLikes(response.users);
			setCount(response.count);
		} catch (err) {
			console.error("Erreur lors du fetch des likes :", err);
		}
	}, [postId]);

	useEffect(() => {
		fetchLikes();
	}, [fetchLikes]);

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchLikes();
		setRefreshing(false);
	}, [fetchLikes]);

	const viewProfile = async (UserPseudo: string, UserPicture: string) => {
		if (!UserPseudo) return;

		hideModal();

		const result = await getInformationsUser(UserPseudo);
		if (currentUser?.username === UserPseudo) {
			console.log("current ");
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

	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{count} {count > 1 ? "likes" : "like"}
			</Text>

			<FlatList
				data={likes}
				keyExtractor={(item) => item.Id.toString()}
				numColumns={5}
				renderItem={({ item }) => (
					<TouchableOpacity
						activeOpacity={0.7}
						onPress={() => viewProfile(item.Pseudo, item.UserPicture ?? "")}
					>
						<Image
							source={{
								uri:
									item.UserPicture ??
									require("../../../../assets/images/avatar.webp"),
							}}
							style={styles.avatar}
						/>
					</TouchableOpacity>
				)}
				columnWrapperStyle={styles.row}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={handleRefresh}
						tintColor={colors.secondary}
					/>
				}
				contentContainerStyle={styles.grid}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 15,
	},
	title: {
		fontSize: 24,
		fontWeight: "600",
		color: colors.white,
		marginBottom: 12,
	},
	grid: {
		paddingBottom: 20,
	},
	row: {
		justifyContent: "flex-start",
		marginBottom: 12,
	},
	avatar: {
		width: 55,
		height: 55,
		borderRadius: 27,
		marginRight: 10,
	},
});
