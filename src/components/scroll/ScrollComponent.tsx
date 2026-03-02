import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import {
	ActivityIndicator,
	Dimensions,
	FlatList,
	type ListRenderItem,
	RefreshControl,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../assets/colors";
import { useScrollLogic } from "../../hooks/useScrollLogic";
import { type Cuite, useCuitesScrollStore } from "../../store/cuites.store";
import useUserStore from "../../store/user.store";
import ItemScroll from "./ItemScroll";

export default function ScrollComponent() {
	const insets = useSafeAreaInsets();
	const { height: fullHeight } = Dimensions.get("window");
	const HEADER_HEIGHT = 30;
	const itemHeight = fullHeight - insets.top - HEADER_HEIGHT;

	const { user } = useUserStore();
	const store = useCuitesScrollStore();
	const { cuites } = store;

	const { loading, loadMoreCuites, refreshCuites } = useScrollLogic(
		user?.username || "",
		store,
		6,
		"scroll",
	);

	const renderItem = useCallback<ListRenderItem<Cuite>>(
		({ item }) => (
			<View style={{ height: itemHeight }}>
				<ItemScroll
					title={item.Titre ?? "Sans titre"}
					description={item.Description ?? null}
					urlPicture={item.UrlPicture}
					UserPseudo={item.UserPseudo}
					UserPicture={item.UserPicture}
					CuiteDate={item.CuiteDate}
					cuiteId={item.Id}
					LikeCount={item.LikeCount}
					LikedByMe={item.LikedByMe}
					CommentCount={item.CommentCount}
					IsCertified={item.IsCertified ?? false}
				/>
			</View>
		),
		[itemHeight],
	);

	if (cuites.length === 0) {
		return (
			<View className="items-center justify-center flex-1 px-4 bg-black">
				<ActivityIndicator
					size="small"
					color={colors.secondary}
					className="mb-4"
				/>
				<Text className="text-lg text-center text-white font-poppins">
					on recupère les pépites...
				</Text>
			</View>
		);
	}

	return (
		<View>
			<FlatList
				data={cuites}
				style={{ height: itemHeight }}
				contentContainerStyle={{}}
				keyExtractor={(item) => item.Id.toString()}
				renderItem={renderItem}
				scrollEnabled={true}
				showsVerticalScrollIndicator={true}
				pagingEnabled
				decelerationRate="fast"
				snapToAlignment="start"
				onEndReached={loadMoreCuites}
				onEndReachedThreshold={0.2}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={() => {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
							refreshCuites();
						}}
						tintColor="#fff"
					/>
				}
				initialNumToRender={1}
				maxToRenderPerBatch={2}
				windowSize={3}
				getItemLayout={(_, index) => ({
					length: itemHeight,
					offset: itemHeight * index,
					index,
				})}
			/>
		</View>
	);
}
