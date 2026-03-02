import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import getInformationsUser from "../../api/users/getInformationsUser.api";
import colors from "../../assets/colors";
import { usePhotoViewerStore } from "../../store/photoViewer.store";
import { usePublicProfileStore } from "../../store/publicProfile.store";
import useUserStore from "../../store/user.store";
import { getRelativeTime } from "../../utils/dateFormat";
import MyIcon from "../icons/MyIcon";
import PostOptionsMenu from "./PostOptionsMenu";
import SocialOptions, { type SocialOptionsHandle } from "./SocialOptions";

type Props = {
	title: string | null;
	description: string | null;
	urlPicture?: string | null;
	UserPseudo: string | null;
	UserPicture?: string | null;
	CuiteDate: string | null;
	cuiteId: number;
	mode?: "scroll" | "profile";
	index?: number;
	LikeCount: number;
	LikedByMe: boolean;
	CommentCount: number;
	IsCertified?: boolean;
};

const blurhash =
	"|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

function ItemScrollComponent({
	title,
	description,
	urlPicture,
	UserPseudo,
	CuiteDate,
	cuiteId,
	UserPicture,
	mode,
	LikeCount,
	LikedByMe,
	CommentCount,
	IsCertified,
}: Props) {
	const [loaded, setLoaded] = useState(false);
	const currentUser = useUserStore((state) => state.user);
	const isMyPost = currentUser?.username === UserPseudo;
	const {
		setUsername,
		setUserPicture,
		setCertified,
		setDescription,
		setStreakDays,
		setTotalCuites,
		setBackgroundName,
	} = usePublicProfileStore();

	const screenWidth = Dimensions.get("window").width;
	const profileItemSize = screenWidth / 3;

	const lastTapRef = useRef<number>(0);
	const socialRef = useRef<SocialOptionsHandle>(null);

	const viewProfile = async () => {
		if (!UserPseudo) return;

		const result = await getInformationsUser(UserPseudo);
		if (currentUser?.username === UserPseudo) {
			console.log("current ");
			router.push("/(tabs)/profile");
			return;
		}

		router.push("/profilePublic");
		setUsername(UserPseudo);
		setCertified(result.user?.IsCertified ?? false);
		setDescription(result.user?.Description ?? null);
		setStreakDays(result.user?.stats.streakDays ?? 0);
		setTotalCuites(result.user?.stats.totalCuites ?? 0);
		setUserPicture(UserPicture ?? null);
		setBackgroundName(result.user?.BackgroundName ?? null);
	};

	const openPhotoViewer = () => {
		if (mode !== "profile") return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		const store = usePhotoViewerStore.getState();
		store.resetCuite();

		store.setCuite({
			title: title ?? "",
			description: description ?? "",
			urlPicture: urlPicture ?? "",
			UserPseudo: UserPseudo ?? "",
			CuiteDate: CuiteDate ?? "",
			cuiteId,
			UserPicture: UserPicture ?? null,
			LikeCount,
			LikedByMe,
			CommentCount,
			IsCertified: IsCertified ?? false,
		});

		router.push("/photoViewer");
	};

	const handleTap = () => {
		if (mode === "profile") openPhotoViewer();
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
		<View
			style={{
				width: mode === "profile" ? profileItemSize : "100%",
				height: "100%",
			}}
			className="relative"
		>
			{urlPicture && (
				<TouchableOpacity activeOpacity={1} onPress={handleTap}>
					<Image
						source={{ uri: urlPicture }}
						style={{
							width: "100%",
							height: "100%",
						}}
						onLoad={() => setLoaded(true)}
						contentFit="cover"
						placeholder={{ blurhash }}
						placeholderContentFit="cover"
						transition={200}
					/>
				</TouchableOpacity>
			)}

			{!loaded && mode !== "profile" && (
				<View pointerEvents="none" className="absolute w-[100%] top-[50%] ">
					<Text className="text-white text-[18px] text-center font-poppins">
						chargement...
					</Text>
				</View>
			)}

			<LinearGradient
				pointerEvents="none"
				colors={[
					"rgba(0,0,0,0.8)",
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
					height: mode !== "profile" ? 200 : 80,
				}}
			/>

			{mode !== "profile" && (
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
						height: 400,
					}}
				/>
			)}

			{mode !== "profile" && (
				<PostOptionsMenu
					isMyPost={isMyPost}
					cuiteId={cuiteId}
					authorPseudo={UserPseudo ?? "random"}
					defaultTitle={title ?? "titre"}
					defaultDescription={description ?? "description"}
					urlPicture={urlPicture ?? ""}
				/>
			)}

			{mode !== "profile" && (
				<TouchableOpacity
					className="absolute flex flex-row gap-2 top-6 left-4"
					onPress={viewProfile}
				>
					<Image
						source={
							UserPicture
								? { uri: UserPicture }
								: require("../../assets/images/avatar.webp")
						}
						style={{
							width: 40,
							height: 40,
							borderRadius: 50,
							alignSelf: "center",
						}}
						contentFit="cover"
						transition={200}
					/>

					<View>
						<View className="flex flex-row items-center gap-1">
							<Text className="text-white text-[20px] font-montserrat">
								{UserPseudo?.toUpperCase()}
							</Text>
							{IsCertified && (
								<MyIcon name="certified" size={25} color={colors.secondary} />
							)}
						</View>

						<Text className="text-white text-[14px] font-poppins">
							{CuiteDate ? getRelativeTime(CuiteDate) : ""}
						</Text>
					</View>
				</TouchableOpacity>
			)}

			{mode === "profile" && (
				<View className="absolute left-0 right-0 items-center justify-center bottom-10">
					<Text className="text-secondary text-[6px] font-montserrat text-center">
						{title?.toUpperCase()}
					</Text>
				</View>
			)}

			{mode === "profile" && (
				<View className="absolute flex flex-col top-4 w-[100%]">
					<Text className="text-white text-[12px] font-poppins text-center">
						{CuiteDate ? getRelativeTime(CuiteDate) : ""}
					</Text>
				</View>
			)}

			{mode !== "profile" && (
				<SocialOptions
					ref={socialRef}
					Id={cuiteId}
					LikeCount={LikeCount}
					LikedByMe={LikedByMe}
					CommentCount={CommentCount}
				/>
			)}

			{mode !== "profile" && (
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
			)}
		</View>
	);
}

export default React.memo(ItemScrollComponent, (prev, next) => {
	return (
		prev.cuiteId === next.cuiteId &&
		prev.title === next.title &&
		prev.description === next.description &&
		prev.urlPicture === next.urlPicture &&
		prev.UserPseudo === next.UserPseudo &&
		prev.UserPicture === next.UserPicture &&
		prev.CuiteDate === next.CuiteDate &&
		prev.mode === next.mode
	);
});
