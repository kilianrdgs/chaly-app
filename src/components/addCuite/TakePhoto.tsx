import { Image as ExpoImage } from "expo-image"; // 👈 important
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Camera } from "react-native-vision-camera";

import * as Haptics from "expo-haptics";
import useNewCuitesStore, { addCuiteStore } from "../../store/addCuite";
import { usePhotoState } from "../../store/photoState.store";
import { trackPictureTaked } from "../../utils/mixpanel";
import MyIcon from "../icons/MyIcon";
import ButtonPicture from "./takePhoto/ButtonPicture";
import CameraCustom from "./takePhoto/CameraCustom";

export default function TakePhotoScreen() {
	const cameraRef = useRef<Camera>(null);
	const resetCuite = useNewCuitesStore((state) => state.resetCuite);
	const [cameraMode, setCameraMode] = useState("back");
	const lastTap = useRef<number>(0);
	const [flash, setFlash] = useState<"on" | "off">("off");
	const replyTo = useNewCuitesStore((state) => state.cuites.replyTo);

	const { mode } = useLocalSearchParams();

	const handleDoubleTap = () => {
		const now = Date.now();
		if (lastTap.current && now - lastTap.current < 300) returnCamera();
		lastTap.current = now;
	};

	const returnCamera = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setCameraMode((prev) => (prev === "back" ? "front" : "back"));
	};

	const flashMode = () => {
		setFlash((prev) => (prev === "off" ? "on" : "off"));
	};

	const handleTakePhoto = async () => {
		resetCuite();
		if (!cameraRef.current) return;

		try {
			addCuiteStore.resetNewCuite();
			const photo = await cameraRef.current.takePhoto({ flash });

			if (!photo?.path) {
				console.log("Erreur lors de la prise de photo");
				return;
			}

			const now = Date.now();
			const newPicture = {
				id: now,
				type: "image",
				uri: photo.path,
			};

			await ExpoImage.prefetch(photo.path);

			const current = useNewCuitesStore.getState().cuites;
			addCuiteStore.setNewCuite({ ...current, media: newPicture });

			trackPictureTaked();
			usePhotoState.getState().setHasTakenPhoto(true);
		} catch (err) {
			console.error("Erreur lors de la prise de photo :", err);
		}
	};

	return (
		<View
			className="flex-1 bg-black"
			onStartShouldSetResponder={() => true}
			onResponderRelease={handleDoubleTap}
		>
			<CameraCustom cameraRef={cameraRef} view={cameraMode} />

			{mode === "response" && (
				<View className="absolute self-center px-4 py-2 top-24 bg-white/10 rounded-xl">
					<Text className="text-sm text-white font-poppins">
						📸 Réponse à <Text className="font-semibold">{replyTo}</Text>
					</Text>
				</View>
			)}

			<View
				className="absolute left-0 right-0 items-center"
				style={{ bottom: 120 }}
			>
				<TouchableOpacity onPress={handleTakePhoto}>
					<ButtonPicture />
				</TouchableOpacity>
			</View>

			<TouchableOpacity
				className="absolute items-center left-5 bottom-12"
				onPress={flashMode}
				style={{ bottom: 120 }}
			>
				<MyIcon
					name={flash === "on" ? "flash" : "no-flash"}
					size={45}
					color="white"
				/>
			</TouchableOpacity>

			<TouchableOpacity
				className="absolute items-center right-5 bottom-12"
				onPress={returnCamera}
				style={{ bottom: 120 }}
			>
				<MyIcon name="switch-camera" size={45} color="white" />
			</TouchableOpacity>
		</View>
	);
}
