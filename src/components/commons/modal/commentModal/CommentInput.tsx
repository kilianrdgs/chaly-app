import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
	Keyboard,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Animated, {
	useAnimatedKeyboard,
	useAnimatedStyle,
} from "react-native-reanimated";
import createComment from "../../../../api/cuites/comment/createComment.api";
import colors from "../../../../assets/colors";
import { useModalStore } from "../../../../store/modal.store";

type Props = {
	idPost: number;
	onSendSuccess?: () => void;
};

export default function CommentInput({ idPost, onSendSuccess }: Props) {
	const [comment, setComment] = useState("");
	const keyboard = useAnimatedKeyboard();
	const { onCommentAdded } = useModalStore();

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: -keyboard.height.value }],
		};
	});

	const handleSend = async () => {
		const trimmed = comment.trim();
		if (!trimmed) return;

		try {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			await createComment(idPost, trimmed);
			Keyboard.dismiss();
			setComment("");
			onSendSuccess?.();
			onCommentAdded?.();
		} catch (err) {
			console.error("Erreur lors de l'envoi du commentaire :", err);
		}
	};

	return (
		<Animated.View style={[styles.wrapper, animatedStyle]}>
			<TextInput
				placeholder="Ajouter un commentaire..."
				placeholderTextColor="#888"
				style={styles.input}
				value={comment}
				onChangeText={setComment}
				returnKeyType="send"
				onSubmitEditing={handleSend}
			/>
			<TouchableOpacity onPress={handleSend}>
				<Text style={styles.sendText}>Envoyer</Text>
			</TouchableOpacity>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		left: 0,
		right: 0,
		height: 45,
		bottom: 0,
		backgroundColor: "#222",
		borderRadius: 20,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 14,
		paddingVertical: 10,
		marginHorizontal: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#333",
	},
	input: {
		flex: 1,
		color: "#fff",
		fontSize: 14,
	},
	sendText: {
		color: colors.secondary,
		fontWeight: "bold",
		marginLeft: 10,
	},
});
