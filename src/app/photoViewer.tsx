import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef } from "react";
import {
	Dimensions,
	Text,
	Touchable,
	TouchableOpacity,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../assets/colors";
import Header from "../components/commons/header/Header";
import MyIcon from "../components/icons/MyIcon";
import PostOptionsMenu from "../components/scroll/PostOptionsMenu";
import SocialOptions, {
	type SocialOptionsHandle,
} from "../components/scroll/SocialOptions";
import { usePhotoViewerStore } from "../store/photoViewer.store";
import useUserStore from "../store/user.store";
import { getRelativeTime } from "../utils/dateFormat";

export default function PhotoViewer() {
	const insets = useSafeAreaInsets();
	const photoUri = usePhotoViewerStore((s) => s.cuite?.urlPicture);
	const UserPicture = usePhotoViewerStore((s) => s.cuite?.UserPicture);
	const UserPseudo = usePhotoViewerStore((s) => s.cuite?.UserPseudo);
	const CuiteDate = usePhotoViewerStore((s) => s.cuite?.CuiteDate);
	const title = usePhotoViewerStore((s) => s.cuite?.title);
	const description = usePhotoViewerStore((s) => s.cuite?.description);
	const cuiteId = usePhotoViewerStore((s) => s.cuite?.cuiteId);
	const LikeCount = usePhotoViewerStore((s) => s.cuite?.LikeCount);
	const LikedByMe = usePhotoViewerStore((s) => s.cuite?.LikedByMe);
	const CommentCount = usePhotoViewerStore((s) => s.cuite?.CommentCount);

	const currentUser = useUserStore((state) => state.user);
	const isMyPost = currentUser?.username === UserPseudo;

	const lastTapRef = useRef<number>(0);
	const socialRef = useRef<SocialOptionsHandle>(null);

	if (!photoUri) return null;

	const SCREEN_WIDTH = Dimensions.get("window").width;
	const moveStartThreshold = 60;
	const closeThreshold = SCREEN_WIDTH * 0.25;
	const velocityThreshold = 800;

	const translateX = useSharedValue(0);

	const panGesture = Gesture.Pan()
		.failOffsetY([-10, 10])
		.onUpdate((e) => {
			if (e.translationX > moveStartThreshold) {
				translateX.value = e.translationX - moveStartThreshold;
			}
		})
		.onEnd((e) => {
			const shouldClose =
				e.translationX > closeThreshold || e.velocityX > velocityThreshold;

			if (shouldClose) {
				runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
				translateX.value = withTiming(
					SCREEN_WIDTH,
					{ duration: 180 },
					(fin) => {
						if (fin) runOnJS(router.back)();
					},
				);
			} else {
				translateX.value = withSpring(0);
			}
		});

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: translateX.value }],
	}));

	const handleTap = () => {
		const now = Date.now();
		if (now - lastTapRef.current < 250) {
			console.log("DOUBLE TAP sur cuite:", cuiteId);
			socialRef.current?.like();
			lastTapRef.current = 0;
			return;
		}
		lastTapRef.current = now;
	};

	return (
		<View className="flex-1 bg-black" style={{ paddingTop: insets.top }}>
			<GestureDetector gesture={panGesture}>
				<Animated.View style={[{ flex: 1 }, animatedStyle]}>
					<Header title="" isSettingPage />
					<View style={{ width: "100%", height: "100%" }} className="relative">
						<TouchableOpacity activeOpacity={1} onPress={handleTap}>
							<Image
								source={{ uri: photoUri }}
								style={{
									width: "100%",
									height: "100%",
									borderRadius: 20,
									borderColor: colors.black,
									borderWidth: 3,
								}}
								contentFit="cover"
								placeholderContentFit="cover"
							/>
						</TouchableOpacity>

						<LinearGradient
							pointerEvents="none"
							colors={[
								"rgba(0,0,0,1)",
								"rgba(0,0,0,0.40)",
								"rgba(0,0,0,0.1)",
								"transparent",
							]}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={{
								top: 0,
								position: "absolute",
								left: 0,
								right: 0,
								height: 200,
							}}
						/>
						<LinearGradient
							pointerEvents="none"
							colors={[
								"rgba(0,0,0,1)",
								"rgba(0,0,0,0.82)",
								"rgba(0,0,0,0.65)",
								"rgba(0,0,0,0.1)",
								"transparent",
							]}
							start={{ x: 0, y: 1 }}
							end={{ x: 0, y: 0 }}
							style={{
								bottom: 0,
								position: "absolute",
								left: 0,
								right: 0,
								height: 200,
							}}
						/>
						<PostOptionsMenu
							isMyPost={isMyPost}
							cuiteId={cuiteId ?? 0}
							authorPseudo={UserPseudo ?? "random"}
							defaultTitle={title ?? "titre"}
							defaultDescription={description ?? "description"}
							urlPicture={photoUri ?? ""}
						/>

						<View className="absolute flex flex-row gap-2 top-6 left-4">
							<Image
								source={
									UserPicture
										? { uri: UserPicture }
										: require("../assets/images/avatar.webp")
								}
								style={{
									width: 40,
									height: 40,
									borderRadius: 50,
									alignSelf: "center",
								}}
								contentFit="cover"
							/>
							<View>
								<View className="flex flex-row items-center gap-1">
									<Text className="text-white text-[20px] font-montserrat">
										{UserPseudo?.toUpperCase()}
									</Text>
									{currentUser?.certified === true && (
										<MyIcon
											name="certified"
											size={25}
											color={colors.secondary}
										/>
									)}
								</View>

								<Text className="text-white text-[14px] font-poppins">
									{CuiteDate ? getRelativeTime(CuiteDate) : ""}
								</Text>
							</View>
						</View>

						<SocialOptions
							Id={cuiteId ?? 0}
							ref={socialRef}
							LikeCount={LikeCount ?? 0}
							LikedByMe={LikedByMe ?? false}
							CommentCount={CommentCount ?? 0}
						/>

						<View className="absolute w-full px-5" style={{ bottom: 100 }}>
							<View className="mb-[5px] flex flex-col">
								<Text className="text-white text-[18px] font-montserrat text-center">
									{title?.toUpperCase()}
								</Text>
							</View>
							<Text className="text-white text-[13px] font-poppins text-center">
								{description}
							</Text>
						</View>
					</View>
				</Animated.View>
			</GestureDetector>
		</View>
	);
}
