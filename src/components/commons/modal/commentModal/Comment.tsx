import { Image } from "expo-image";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import deleteComment from "../../../../api/cuites/comment/deleteComment.api";
import getInformationsUser from "../../../../api/users/getInformationsUser.api";
import colors from "../../../../assets/colors";
import { useModalStore } from "../../../../store/modal.store";
import { usePublicProfileStore } from "../../../../store/publicProfile.store";
import useUserStore from "../../../../store/user.store";
import { getRelativeTime } from "../../../../utils/dateFormat";
import MyIcon from "../../../icons/MyIcon";

type CommentProps = {
	comment: {
		Id: number;
		Comment: string;
		CreatedAt: string;
		UserPseudo: string;
		UserPicture: string | null;
	};
	onDelete?: () => void;
};

export default function Comment({ comment, onDelete }: CommentProps) {
	const { user } = useUserStore();
	const { onCommentDeleted } = useModalStore();
	const {
		setUsername,
		setUserPicture,
		setCertified,
		setDescription,
		setStreakDays,
		setTotalCuites,
		setBackgroundName,
	} = usePublicProfileStore();
	const { hideModal } = useModalStore();
	const currentUser = useUserStore((state) => state.user);

	const handleDelete = () => {
		Alert.alert(
			"Suppresion",
			"Tu veux vraiment ce commentaire ?",
			[
				{ text: "Annuler", style: "cancel" },
				{
					text: "Oui",
					style: "destructive",
					onPress: async () => {
						try {
							await deleteComment(comment.Id);
							onDelete?.();
							onCommentDeleted?.();
						} catch (err) {
							console.error("Erreur suppression commentaire :", err);
						}
					},
				},
			],
			{ cancelable: true },
		);
	};

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
		<View style={styles.commentContainer}>
			<TouchableOpacity
				onPress={() =>
					viewProfile(comment.UserPseudo, comment.UserPicture ?? "")
				}
			>
				<Image
					source={
						comment.UserPicture
							? { uri: comment.UserPicture }
							: require("../../../../assets/images/avatar.webp")
					}
					style={styles.avatar}
				/>
			</TouchableOpacity>

			<View style={{ flex: 1 }}>
				<View style={styles.commentHeader}>
					<TouchableOpacity
						onPress={() =>
							viewProfile(comment.UserPseudo, comment.UserPicture ?? "")
						}
					>
						<Text style={styles.username}>{comment.UserPseudo}</Text>
					</TouchableOpacity>

					<Text style={styles.time}>{getRelativeTime(comment.CreatedAt)}</Text>
				</View>
				<Text style={styles.commentText}>{comment.Comment}</Text>
			</View>
			{(user?.username === comment.UserPseudo || user?.moderator) && (
				<TouchableOpacity
					style={{ alignSelf: "center" }}
					onPress={handleDelete}
				>
					<MyIcon name="delete" size={20} color={colors.secondary} />
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	commentContainer: {
		flexDirection: "row",
		marginBottom: 14,
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		marginRight: 10,
	},
	commentHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 2,
	},
	username: {
		color: "#fff",
		fontWeight: "600",
		marginRight: 8,
	},
	time: {
		color: "#aaa",
		fontSize: 12,
	},
	commentText: {
		color: "#eee",
		fontSize: 14,
	},
});
