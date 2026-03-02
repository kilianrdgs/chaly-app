import { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
	Camera,
	type CameraDevice,
	useCameraDevices,
	useCameraPermission,
} from "react-native-vision-camera";

type CameraCustomProps = {
	view: string;
	cameraRef: React.RefObject<Camera | null>;
};

export default function CameraCustom({ cameraRef, view }: CameraCustomProps) {
	const { hasPermission, requestPermission } = useCameraPermission();
	const devices = useCameraDevices();

	useEffect(() => {
		if (!hasPermission) {
			requestPermission();
		}
	}, [hasPermission, requestPermission]);

	const device = useMemo<CameraDevice | undefined>(() => {
		const matchingDevices = devices.filter((d) => d.position === view);

		const ultraWideAndroid = matchingDevices.find(
			(d) =>
				d.name?.toLowerCase().includes("ultra") ||
				d.name?.toLowerCase().includes("wide"),
		);

		const ultraWideIOS = matchingDevices.find((d) =>
			d.physicalDevices?.includes("ultra-wide-angle-camera"),
		);

		const wideIOS = matchingDevices.find((d) =>
			d.physicalDevices?.includes("wide-angle-camera"),
		);

		return ultraWideAndroid || ultraWideIOS || wideIOS || matchingDevices[0];
	}, [devices, view]);

	if (!device || !hasPermission) return <View />;

	return (
		<Camera
			style={StyleSheet.absoluteFill}
			device={device}
			isActive={true}
			ref={cameraRef}
			photo={true}
			enableZoomGesture={true}
			photoQualityBalance="speed"
			outputOrientation="preview"
			video={true}
		/>
	);
}
