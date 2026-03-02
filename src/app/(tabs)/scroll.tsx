import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect } from "react";
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
import getCuitesList from "../../api/cuites/getCuitesList.api";
import Header from "../../components/commons/header/Header";
import ScrollComponent from "../../components/scroll/ScrollComponent";
import { useCuitesScrollStore } from "../../store/cuites.store";
import { usePublicProfileStore } from "../../store/publicProfile.store";

export default function Scroll() {
	const insets = useSafeAreaInsets();
	const translateX = useSharedValue(0);
	const { setProfileMode } = usePublicProfileStore();

	const {
		setCuites,
		setLoading,
		reset,
		shouldRefetch,
		setLastFetched,
		setHasFetched,
	} = useCuitesScrollStore();

	useEffect(() => {
		const fetchCuites = async () => {
			setProfileMode("scroll");
			const TTL_SCROLL_FEED = 120_000;
			if (!shouldRefetch(TTL_SCROLL_FEED)) return;

			setLoading(true);
			reset();
			try {
				const result = await getCuitesList(6, null, "scroll", "");
				if (result) {
					setCuites(result.cuites, result.nextCursor);
					setHasFetched(true);
					setLastFetched(Date.now());
				}
			} catch (error) {
				console.error("Erreur lors du chargement des cuites :", error);
			} finally {
				setLoading(false);
			}
		};

		fetchCuites();
	}, [
		reset,
		setCuites,
		setHasFetched,
		setProfileMode,
		shouldRefetch,
		setLoading,
		setLastFetched,
	]);

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const horizontalThreshold = 80;
	const moveStartThreshold = 60;

	const panGesture = Gesture.Pan()
		.onUpdate((e) => {
			const absX = Math.abs(e.translationX);
			const absY = Math.abs(e.translationY);

			if (absX > absY && e.translationX < -moveStartThreshold) {
				translateX.value = e.translationX + moveStartThreshold;
			}
		})
		.onEnd((e) => {
			if (e.translationX < -horizontalThreshold) {
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
					<Header title="DÉCOUVRE LES PÉPITES" />
					<ScrollComponent />
				</Animated.View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}
