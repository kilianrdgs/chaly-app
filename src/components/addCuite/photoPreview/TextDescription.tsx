import { Text, View } from "react-native";

type Props = {
	mediaValidate: boolean;
	description: string;
};

export default function TextDescription({ mediaValidate, description }: Props) {
	return (
		<View className="w-full ">
			{mediaValidate && (
				<View>
					<Text className="text-white text-[18px] font-poppins text-center mt-2 mb-2">
						{description}
					</Text>
				</View>
			)}
		</View>
	);
}
