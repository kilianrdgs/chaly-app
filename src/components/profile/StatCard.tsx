import { Text, TouchableOpacity, View } from "react-native";
import colors from "../../assets/colors";

type Props = {
	emoji: string;
	value: number | string;
	label: string;
};

export default function StatCard({ emoji, value, label }: Props) {
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			className="items-center justify-center w-24 h-24 mx-1 border rounded-2xl bg-zinc-900"
		>
			<Text className="mb-1 text-2xl">{emoji}</Text>
			<Text className="text-white text-[20px] font-bold">{value}</Text>
			<Text className="text-[11px] mt-1 uppercase tracking-wide text-secondary">
				{label}
			</Text>
		</TouchableOpacity>
	);
}
