import { Text, View } from "react-native";
import useUserStore from "../../store/user.store";

export default function DescriptionProfile() {
	const { user } = useUserStore();
	return (
		<View className="flex-row items-center justify-center gap-2 mt-2">
			<Text className="text-[16px] font-semibold text-center text-white font-poppins">
				{user?.description || "Toujours en quête de vibes 🔮"}
			</Text>
		</View>
	);
}
