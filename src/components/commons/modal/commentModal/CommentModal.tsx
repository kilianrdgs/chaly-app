import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import getComments from "../../../../api/cuites/comment/getComments.api";
import colors from "../../../../assets/colors";
import { useModalStore } from "../../../../store/modal.store";
import Comment from "./Comment";
import CommentInput from "./CommentInput";

type CommentData = {
	Id: number;
	Comment: string;
	CreatedAt: string;
	UserPseudo: string;
	UserPicture: string | null;
};

export default function CommentModal() {
	const { postId } = useModalStore();
	const [comments, setComments] = useState<CommentData[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const flatListRef = useRef<FlatList>(null);

	const fetchComments = useCallback(async () => {
		if (!postId) return;
		try {
			const response = await getComments(postId);
			setComments(response);
		} catch (err) {
			console.error("Erreur lors du fetch des commentaires :", err);
		}
	}, [postId]);

	useEffect(() => {
		fetchComments();
	}, [fetchComments]);

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		await fetchComments();
		setRefreshing(false);
	}, [fetchComments]);

	return (
		<View style={styles.container}>
			<View style={{ maxHeight: 330 }}>
				<FlatList
					ref={flatListRef}
					data={comments}
					keyExtractor={(item) => item.Id.toString()}
					renderItem={({ item }) => (
						<Comment comment={item} onDelete={fetchComments} />
					)}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={handleRefresh}
							tintColor={colors.secondary}
						/>
					}
					ListEmptyComponent={
						<View style={styles.noComment}>
							<Text className="mb-5 text-white font-poppins">
								Aucun Commentaire...
							</Text>
						</View>
					}
				/>
			</View>
			<View style={{ bottom: 10 }}>
				<CommentInput
					idPost={postId ?? 0}
					onSendSuccess={() => {
						fetchComments();
						setTimeout(() => {
							flatListRef.current?.scrollToEnd({ animated: true });
						}, 300);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 10,
	},
	scrollContent: {
		paddingBottom: 10,
	},
	noComment: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
