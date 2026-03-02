import { ActivityIndicator, Text, View } from "react-native";
import colors from "../../../assets/colors";

export default function LoadingPublish() {
	return (
		<View className="absolute inset-0 z-50 items-center justify-center bg-black/80">
			<ActivityIndicator size="large" color={colors.secondary} />
			<Text className="mt-4 text-lg text-white font-poppins">
				Publication en cours... 😏
			</Text>
		</View>
	);
}
