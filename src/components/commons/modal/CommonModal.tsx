import { useCallback, useEffect, useState } from "react";
import {
	Dimensions,
	Keyboard,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withSpring,
	withTiming,
	runOnJS,
} from "react-native-reanimated";
import { useModalStore } from "../../../store/modal.store";
import CommentModal from "./commentModal/CommentModal";
import LikeModal from "./likeModal/LikeModal";

const screenHeight = Dimensions.get("window").height;
const MAX_MODAL_HEIGHT = screenHeight * 0.5;

export default function CommonModal() {
	const { isVisible, hideModal, modalType } = useModalStore();
	const [shouldRender, setShouldRender] = useState(false);

	const translateY = useSharedValue(MAX_MODAL_HEIGHT);
	const overlayOpacity = useSharedValue(0);

	const scrollTo = useCallback(
		(destination: number, after?: () => void) => {
			"worklet";
			translateY.value = withSpring(
				destination,
				{ damping: 25, stiffness: 300, mass: 0.4 },
				(finished) => {
					if (finished && after) runOnJS(after)();
				},
			);
		},
		[translateY],
	);

	const close = useCallback(() => {
		Keyboard.dismiss();
		overlayOpacity.value = withTiming(0, { duration: 150 });
		scrollTo(MAX_MODAL_HEIGHT, () => {
			runOnJS(setShouldRender)(false);
			runOnJS(hideModal)();
		});
	}, [scrollTo, overlayOpacity, hideModal]);

	const gesture = Gesture.Pan()
		.onUpdate((e) => {
			if (e.translationY > 0) translateY.value = e.translationY;
		})
		.onEnd((e) => {
			if (e.translationY > 50) runOnJS(close)();
			else scrollTo(0);
		});

	useEffect(() => {
		if (isVisible) {
			setShouldRender(true);
			scrollTo(0);
			overlayOpacity.value = withTiming(1, { duration: 200 });
		} else {
			close();
		}
	}, [isVisible, scrollTo, overlayOpacity, close]);

	const modalStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
	}));

	const overlayStyle = useAnimatedStyle(() => ({
		opacity: overlayOpacity.value,
	}));

	if (!shouldRender) return null;

	return (
		<View style={StyleSheet.absoluteFill} pointerEvents="box-none">
			<Pressable style={styles.pressable} onPress={close}>
				<Animated.View style={[styles.overlay, overlayStyle]} />
			</Pressable>

			<GestureDetector gesture={gesture}>
				<Animated.View style={[styles.modal, modalStyle]}>
					<View style={styles.handleContainer}>
						<View style={styles.handle} />
					</View>

					<View style={styles.content}>
						{modalType === "comments" ? (
							<CommentModal />
						) : modalType === "likes" ? (
							<LikeModal />
						) : null}
					</View>
				</Animated.View>
			</GestureDetector>
		</View>
	);
}

const styles = StyleSheet.create({
	pressable: {
		...StyleSheet.absoluteFillObject,
	},
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.4)",
	},
	modal: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "#111",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 16,
		zIndex: 9999,
		elevation: 9999,
		maxHeight: MAX_MODAL_HEIGHT,
	},
	handleContainer: {
		alignItems: "center",
		marginBottom: 8,
	},
	handle: {
		width: 40,
		height: 4,
		borderRadius: 2,
		backgroundColor: "#444",
	},
	content: {
		flexGrow: 1,
	},
});
