import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
	ActivityIndicator,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import getMyInfos from "../../api/users/getUser.api";
import modifyProfilePicture from "../../api/users/modifyProfilePicture.api";
import colors from "../../assets/colors";
import { usePublicProfileStore } from "../../store/publicProfile.store";
import useUserStore from "../../store/user.store";
import {
	PROFILE_PIC_PATH,
	downloadProfilePicture,
} from "../../utils/downloadProfilePicture";
import { compressImage } from "../../utils/mediaCompression";

export default function UserAvatar({
	isOwnProfile,
}: {
	isOwnProfile: boolean;
}) {
	const { user } = useUserStore();
	const { userPicture: publicPdp } = usePublicProfileStore();
	const [loading, setLoading] = useState(false);
	const [imageVersion, setImageVersion] = useState(Date.now());

	const size = 120;
	const strokeWidth = 6;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = user?.xpTotal ? user.xpTotal / 100 : 0;
	const strokeDashoffset = circumference * (1 - progress);

	const handlePress = async () => {
		if (!isOwnProfile) return;

		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert("Permission d’accéder à la galerie refusée.");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.4,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setLoading(true);
			const compressedUri = await compressImage(result.assets[0].uri);

			const response = await modifyProfilePicture(compressedUri);
			if (!response) return;

			if (response === true) {
				const refreshedUser = await getMyInfos();
				const latestPhotoUrl = refreshedUser?.user?.PhotoUrl;
				if (latestPhotoUrl) {
					await downloadProfilePicture(latestPhotoUrl);
					setImageVersion(Date.now());
				}
				setLoading(false);
			}
		}
	};

	const imageSource = isOwnProfile
		? `${PROFILE_PIC_PATH}?v=${imageVersion}`
		: (publicPdp ?? require("../../assets/images/avatar.webp"));

	return (
		<View style={styles.container}>
			{isOwnProfile && (
				<Svg
					width={size}
					height={size}
					style={[
						StyleSheet.absoluteFill,
						{ transform: [{ rotate: "-90deg" }] },
					]}
				>
					<Circle
						stroke={colors.darkGray}
						fill="none"
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeWidth={strokeWidth}
					/>
					<Circle
						stroke={colors.secondary}
						fill="none"
						cx={size / 2}
						cy={size / 2}
						r={radius}
						strokeWidth={strokeWidth}
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
					/>
				</Svg>
			)}

			<TouchableOpacity
				style={styles.profilePp}
				onPress={handlePress}
				disabled={!isOwnProfile}
			>
				<View style={{ flex: 1 }}>
					{loading && isOwnProfile ? (
						<View className="items-center justify-center flex-1 rounded-full bg-bigGray">
							<ActivityIndicator size="small" color={colors.secondary} />
						</View>
					) : (
						<Image
							source={{
								uri: typeof imageSource === "string" ? imageSource : undefined,
							}}
							style={styles.profilImage}
							contentFit="cover"
							placeholderContentFit="cover"
							defaultSource={
								typeof imageSource === "string" ? undefined : imageSource
							}
						/>
					)}
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 120,
		height: 120,
		marginHorizontal: "auto",
		justifyContent: "center",
		alignItems: "center",
	},
	profilePp: {
		width: 100,
		height: 100,
		borderRadius: 60,
		backgroundColor: colors.bigGray,
		overflow: "hidden",
	},
	profilImage: {
		width: "100%",
		height: "100%",
		borderRadius: 60,
	},
});
