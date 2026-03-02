import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import createCuite from "../../api/cuites/createCuite.api";
import getCuitesList from "../../api/cuites/getCuitesList.api";
import verifyMedia from "../../api/cuites/verifyMedia.api";
import sendNotifs from "../../api/users/sendNotifs";
import useNewCuitesStore, { addCuiteStore } from "../../store/addCuite";
import { useCuitesScrollStore } from "../../store/cuites.store";
import { usePhotoState } from "../../store/photoState.store";
import useUserStore from "../../store/user.store";
import { useProfileCuitesStore } from "../../store/userCuites.store";
import { getUserLocation } from "../../utils/accessLocation";
import { compressImage } from "../../utils/mediaCompression";
import { useToast } from "../commons/toast/Toast";
import MyIcon from "../icons/MyIcon";
import BtnBack from "./photoPreview/BtnBack";
import LoadingPreview from "./photoPreview/LoadingPreview";
import TextDescription from "./photoPreview/TextDescription";
import TitlesList from "./photoPreview/TitlesList";

type AnalyseResponse = {
	titles: string[];
	description: string;
};

export default function PhotoPreviewScreen() {
	const cuites = useNewCuitesStore((state) => state.cuites);
	const setValidate = usePhotoState((state) => state.setMediaValidate);
	const mediaValidate = usePhotoState((state) => state.mediaValidate);
	const [isLoading, setIsLoading] = useState(false);
	const [isPostingLoading, setIsPostingLoading] = useState(false);
	const resetCuite = useNewCuitesStore((state) => state.resetCuite);
	const { openToast } = useToast();
	const { prependCuite } = useProfileCuitesStore.getState();
	const replyTo = useNewCuitesStore((state) => state.cuites.replyTo);
	const lastTitle = useNewCuitesStore((state) => state.cuites.lastTitle);
	const lastDescription = useNewCuitesStore(
		(state) => state.cuites.lastDescription,
	);
	const { user } = useUserStore();

	const uri = cuites?.media?.uri?.startsWith("file://")
		? cuites.media.uri
		: `file://${cuites?.media?.uri}`;

	const { mode } = useLocalSearchParams();
	const clean = (value: string | null | undefined): string | undefined =>
		value ?? undefined;

	const handlePress = async (reload: boolean) => {
		if (isLoading || isPostingLoading) return;
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		if (reload === true) {
			setValidate(false);
		}

		if (!isLoading && cuites.media && (!mediaValidate || reload)) {
			setIsLoading(true);
			const [lng, lat] = await getUserLocation();
			const compressedUri = await compressImage(cuites.media.uri);

			const current = useNewCuitesStore.getState().cuites;
			let response: AnalyseResponse;

			if (mode === "response") {
				response = await verifyMedia(
					compressedUri,
					clean(replyTo),
					clean(lastTitle),
					clean(lastDescription),
				);
			} else {
				response = await verifyMedia(compressedUri);
			}

			addCuiteStore.setNewCuite({
				...current,
				description: response.description,
				title: response.titles[0],
				titles: response.titles,
				location: { longitude: lng, latitude: lat },
				date: new Date(),
			});

			setValidate(true);
			setIsLoading(false);
			return;
		}

		if (mediaValidate) {
			setIsPostingLoading(true);
			const cuite = useNewCuitesStore.getState().cuites;

			if (!cuite.media || !cuite.media.uri) {
				setIsPostingLoading(false);
				return openToast("error", "Aucune image à publier");
			}
			const media = cuite.media;

			router.back();
			openToast("info", "En cours de publication...", {
				status: "loading",
				mediaUri: cuite.media?.uri,
			});

			(async () => {
				try {
					const compressedUri = await compressImage(media.uri, true);
					const response = await createCuite({
						...cuite,
						media: {
							uri: compressedUri,
							id: media.id,
							type: media.type,
						},
					});

					if (response === true) {
						resetCuite();

						const { setCuites, setLoading, reset } =
							useCuitesScrollStore.getState();
						setLoading(true);
						setValidate(false);
						reset();

						const result = await getCuitesList(9, null, "scroll", "");
						if (result) {
							setCuites(result.cuites, result.nextCursor);
						}

						if (user?.username) {
							const resultProfile = await getCuitesList(
								1,
								null,
								"profile",
								user?.username,
							);
							if (resultProfile?.cuites.length > 0) {
								prependCuite(resultProfile.cuites[0]);
							}
						}

						if (mode === "response" && replyTo) {
							sendNotifs(replyTo);
						}

						openToast("success", "Publié! 😜", {
							status: "success",
							mediaUri: cuite.media?.uri,
						});
					} else {
						openToast("error", "Erreur lors de la publication");
					}
				} catch (error) {
					console.error("Erreur lors de la publication :", error);
					openToast("error", "Erreur lors de la publication");
				} finally {
					setIsPostingLoading(false);
				}
			})();
		}
	};

	return (
		<View className="flex-1 bg-black">
			<View className="relative flex-1 w-full">
				<Image
					source={{ uri }}
					style={{ height: "100%", width: "100%", position: "absolute" }}
					cachePolicy="memory-disk"
				/>
				<LinearGradient
					colors={[
						"rgba(0,0,0,0.8)",
						"rgba(0,0,0,0.50)",
						"rgba(0,0,0,0.20)",
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
				<BtnBack onMap={false} />
				{!isLoading && mediaValidate && (
					<TouchableOpacity
						className="absolute top-[15px] right-[15px]"
						onPress={() => handlePress(true)}
					>
						<MyIcon name="reload" size={38} color="white" />
					</TouchableOpacity>
				)}

				{isLoading && <LoadingPreview />}
				{!isLoading && (
					<View
						className="absolute bottom-40 mx-4 p-3 rounded-2xl w-[92%] space-y-3 z-10"
						style={
							mediaValidate
								? { backgroundColor: "rgba(0,0,0,0.8)" }
								: { backgroundColor: "transparent" }
						}
					>
						<TitlesList mediaValidate={mediaValidate} />
						<TextDescription
							mediaValidate={mediaValidate}
							description={cuites.description || ""}
						/>
						{!isPostingLoading && (
							<LinearGradient
								colors={["#ff4ecd", "#9e6fff"]}
								start={{ x: 0, y: 0 }}
								end={{ x: 1, y: 1 }}
								className="self-center mt-2 rounded-full"
								style={{
									paddingHorizontal: 24,
									paddingVertical: 12,
									borderRadius: 50,
									alignSelf: "center",
									maxWidth: 200,
								}}
							>
								<TouchableOpacity
									onPress={() => handlePress(false)}
									activeOpacity={0.8}
								>
									<Text className="text-lg font-bold text-center text-white font-montserrat">
										{isPostingLoading
											? ""
											: mediaValidate
												? "PUBLIER 🚀"
												: !isLoading
													? "SUIVANT 🪄✨"
													: ""}
									</Text>
								</TouchableOpacity>
							</LinearGradient>
						)}
					</View>
				)}
			</View>
		</View>
	);
}

//
//         <TextReply mode={mode ? mode : ""} replyTo={replyTo ? replyTo : ""} />

//
//         {isPostingLoading && <LoadingPublish />}
//         {mediaValidate && <CustomGradient />}

//       </View>
