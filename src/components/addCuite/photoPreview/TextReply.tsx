import { Text, View } from "react-native";

type Props = {
	mode: string | string[];
	replyTo: string;
};

export default function TextReply({ mode, replyTo }: Props) {
	if (mode === "response") {
		return (
			<View className="absolute self-center px-4 py-2 top-5 bg-white/10 rounded-xl">
				<Text className="text-sm text-white font-poppins">
					📸 Réponse à <Text className="font-semibold">{replyTo}</Text>
				</Text>
			</View>
		);
	}
}
