import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/commons/header/Header";
import ProfileComponent from "../../components/profile/ProfileComponent";
export default function Profile() {
	const insets = useSafeAreaInsets();
	const translateX = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const horizontalThreshold = 80;
	const moveStartThreshold = 60;

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			const absX = Math.abs(e.translationX);
			const absY = Math.abs(e.translationY);

			if (absX > absY && e.translationX > moveStartThreshold) {
				translateX.value = e.translationX - moveStartThreshold;
			}
		})
		.onEnd((e) => {
			if (e.translationX > horizontalThreshold) {
				runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
				runOnJS(router.push)("/(tabs)");
			}
			translateX.value = withSpring(0);
		});

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0A0A" }}>
			<GestureDetector gesture={panGesture}>
				<Animated.View
					style={[
						{ flex: 1, backgroundColor: "#0A0A0A", paddingTop: insets.top },
						animatedStyle,
					]}
				>
					<Header title="PROFIL" />
					<ProfileComponent />
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
