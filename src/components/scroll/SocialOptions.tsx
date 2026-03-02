import * as Haptics from "expo-haptics";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import likeCuite from "../../api/cuites/like/likeCuite.api";
import colors from "../../assets/colors";
import { useModalStore } from "../../store/modal.store";
import MyIcon from "../icons/MyIcon";

interface SocialOptionsProps {
	Id: number;
	LikeCount: number;
	LikedByMe: boolean;
	CommentCount: number;
}

export type SocialOptionsHandle = { like: () => void };

const SocialOptions = forwardRef<SocialOptionsHandle, SocialOptionsProps>(
	(props, ref) => {
		const [liked, setLiked] = useState(props.LikedByMe);
		const [likeCount, setLikeCount] = useState(props.LikeCount ?? 0);
		const [commentCount, setCommentCount] = useState(props.CommentCount ?? 0);
		const [isLoading, setIsLoading] = useState(false);
		const { showModal } = useModalStore();

		const handlePress = useCallback(async () => {
			if (isLoading) return;
			setIsLoading(true);
			try {
				Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
				const nextLiked = !liked;
				await likeCuite(liked, props.Id);
				setLiked(nextLiked);
				setLikeCount((prev) => (nextLiked ? prev + 1 : prev - 1));
			} catch (err) {
				console.error("Erreur lors du like:", err);
			} finally {
				setIsLoading(false);
			}
		}, [isLoading, liked, props.Id]);

		useImperativeHandle(
			ref,
			() => ({
				like: () => {
					handlePress();
				},
			}),
			[handlePress],
		);

		const handleLongPress = () => {
			showModal(props.Id, "likes");
			console.log("test");
		};

		return (
			<View style={{ position: "absolute", bottom: 220, right: 15, gap: 5 }}>
				<View>
					<TouchableOpacity
						onPress={handlePress}
						disabled={isLoading}
						onLongPress={handleLongPress}
						delayLongPress={400}
					>
						<MyIcon
							name="heart"
							size={32}
							color={liked ? colors.secondary : colors.white}
						/>
					</TouchableOpacity>
					<Text
						style={{ fontSize: 13, color: colors.white, textAlign: "center" }}
					>
						{likeCount}
					</Text>
				</View>

				<View>
					<TouchableOpacity
						onPress={() =>
							showModal(
								props.Id,
								"comments",
								() => setCommentCount((prev) => prev + 1),
								() => setCommentCount((prev) => Math.max(prev - 1, 0)),
							)
						}
					>
						<MyIcon name="comment" size={32} color={colors.white} />
					</TouchableOpacity>
					<Text
						style={{ fontSize: 13, color: colors.white, textAlign: "center" }}
					>
						{commentCount}
					</Text>
				</View>
			</View>
		);
	},
);

export default SocialOptions;
