import { Text, View } from "react-native";

type Props = {
	mediaValidate: boolean;
	title: string;
};

export default function HeaderPreview({ mediaValidate, title }: Props) {
	return (
		<View className="h-10 bg-black">
			<Text className="text-white text-[18px] font-black text-center">
				{mediaValidate ? title?.toUpperCase() : "PHOTO VALIDÉE ?"}
			</Text>
		</View>
	);
}
