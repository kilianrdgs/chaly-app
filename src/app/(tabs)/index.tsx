import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { View } from "react-native";
import {
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PhotoPreviewScreen from "../../components/addCuite/PhotoPreview";
import TakePhotoScreen from "../../components/addCuite/TakePhoto";
import Header from "../../components/commons/header/Header";
import useNewCuitesStore from "../../store/addCuite";
import { usePhotoState } from "../../store/photoState.store";

export default function AddCuite() {
	const insets = useSafeAreaInsets();

	// Stores
	const hasTakenPhoto = usePhotoState((s) => s.hasTakenPhoto);
	const setHasTakenPhoto = usePhotoState((s) => s.setHasTakenPhoto);
	const setValidate = usePhotoState((s) => s.setMediaValidate);
	const resetCuite = useNewCuitesStore((s) => s.resetCuite);
	const uri = useNewCuitesStore((s) => s.cuites.media?.uri);
	const isReady = hasTakenPhoto && !!uri;

	// Animations
	const translateY = useSharedValue(0);
	const translateX = useSharedValue(0);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [
			{ translateX: translateX.value },
			{ translateY: translateY.value },
		],
	}));

	// Fermer preview
	const handleClosePreview = () => {
		setHasTakenPhoto(false);
		setValidate(false);
		resetCuite();
		translateY.value = 0;
		translateX.value = 0;
	};

	// Seuils
	const verticalThreshold = 100;
	const horizontalThreshold = 80;
	const moveStartThreshold = 60;
	const velocityThreshold = 800;

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			const absX = Math.abs(e.translationX);
			const absY = Math.abs(e.translationY);

			// Swipe vertical autorisé seulement si photo prise
			if (isReady && absY > absX && e.translationY > moveStartThreshold) {
				translateY.value = e.translationY - moveStartThreshold;
			}

			// Swipe horizontal toujours autorisé
			if (absX > moveStartThreshold) {
				translateX.value =
					e.translationX > 0
						? e.translationX - moveStartThreshold
						: e.translationX + moveStartThreshold;
			}
		})
		.onEnd((e) => {
			const absX = Math.abs(e.translationX);
			const absY = Math.abs(e.translationY);

			// Fermeture preview si vertical dominant et photo prise
			if (isReady && absY > absX) {
				const shouldClose =
					e.translationY > verticalThreshold || e.velocityY > velocityThreshold;
				if (shouldClose) {
					runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
					translateY.value = withTiming(800, { duration: 200 }, (finished) => {
						if (finished) runOnJS(handleClosePreview)();
					});
				} else {
					translateY.value = withSpring(0);
				}
			}

			// Navigation horizontale
			if (e.translationX > horizontalThreshold) {
				runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
				runOnJS(router.push)("/(tabs)/scroll");
			} else if (e.translationX < -horizontalThreshold) {
				runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
				runOnJS(router.push)("/(tabs)/profile");
			}
			translateX.value = withSpring(0);
		});

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
				<Header title="CHALY" />

				<GestureDetector gesture={panGesture}>
					<Animated.View style={[{ flex: 1 }, animatedStyle]}>
						{/* Caméra */}
						<View
							className="absolute top-0 bottom-0 left-0 right-0"
							style={{ zIndex: isReady ? 0 : 1 }}
						>
							<TakePhotoScreen />
						</View>

						{/* Preview */}
						{isReady && (
							<Animated.View
								className="absolute top-0 bottom-0 left-0 right-0"
								style={{ zIndex: 1 }}
							>
								<PhotoPreviewScreen />
							</Animated.View>
						)}
					</Animated.View>
				</GestureDetector>
			</View>
		</GestureHandlerRootView>
	);
}
