import { router } from "expo-router";
import { View } from "react-native";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../components/commons/header/Header";
import UserProfileComponent from "../components/profile/UserProfileComponent";

export default function ProfilePublic() {
	const insets = useSafeAreaInsets();

	const SCREEN_WIDTH = Dimensions.get("window").width;
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

	return (
		<View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[{ flex: 1 }, animatedStyle]}>
					<UserProfileComponent />
				</Animated.View>
			</GestureDetector>
		</View>
	);
}
