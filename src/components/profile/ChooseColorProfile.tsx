// components/profile/ChooseColorProfile.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
	BG_MAP,
	type GradientName,
	type GradientTuple,
} from "../../utils/backgroundProfile";

type Option = { slug: GradientName; label: string; colors: GradientTuple };

const OPTIONS: Option[] = [
	{ slug: "black", label: "Noir", colors: BG_MAP.black },
	{ slug: "pink", label: "Rose Néon", colors: BG_MAP.pink },
	{ slug: "indigo", label: "Indigo Profond", colors: BG_MAP.indigo },
	{ slug: "teal", label: "Turquoise", colors: BG_MAP.teal },
	{ slug: "rose", label: "Framboise", colors: BG_MAP.rose },
	{ slug: "blue", label: "Bleu Électrique", colors: BG_MAP.blue },
	{ slug: "mint", label: "Menthe", colors: BG_MAP.mint },
	{ slug: "ultraviolet", label: "Ultra Violet", colors: BG_MAP.ultraviolet },
	{
		slug: "electricCyan",
		label: "Cyan Électrique",
		colors: BG_MAP.electricCyan,
	},
	{ slug: "laserLime", label: "Lime Laser", colors: BG_MAP.laserLime },
	{ slug: "sunset", label: "Coucher de Soleil", colors: BG_MAP.sunset },
	{ slug: "amber", label: "Ambre Néon", colors: BG_MAP.amber },
	{ slug: "miami", label: "Miami Night", colors: BG_MAP.miami },
	{ slug: "candyPeach", label: "Pêche Candy", colors: BG_MAP.candyPeach },
	{ slug: "plumCandy", label: "Prune Candy", colors: BG_MAP.plumCandy },
];

export default function ChooseColorProfile({
	value,
	onChange,
}: {
	value?: GradientName | null;
	onChange?: (slug: GradientName) => void;
}) {
	const initialIndex = useMemo(() => {
		const key = (value as GradientName) || "black";
		const i = OPTIONS.findIndex((o) => o.slug === key);
		return i >= 0 ? i : 0;
	}, [value]);

	const [selected, setSelected] = useState(initialIndex);
	useEffect(() => {
		setSelected(initialIndex);
	}, [initialIndex]);

	return (
		<View className="mt-6 ">
			<Text className="mb-3 text-[14px] font-semibold text-white font-poppins">
				Personnaliser la couleur du profil
			</Text>
			<View className="flex-row flex-wrap justify-center gap-3">
				{OPTIONS.map((opt, idx) => (
					<TouchableOpacity
						key={opt.slug}
						onPress={() => {
							setSelected(idx);
							onChange?.(opt.slug);
						}}
						activeOpacity={0.85}
					>
						<LinearGradient
							colors={opt.colors}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								width: 56,
								height: 56,
								borderRadius: 9999,
								borderWidth: selected === idx ? 3 : 0,
								borderColor: "#fff",
							}}
						/>
					</TouchableOpacity>
				))}
			</View>
		</View>
	);
}
