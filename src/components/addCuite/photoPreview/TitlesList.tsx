import { ScrollView, Text, TouchableOpacity } from "react-native";
import useNewCuitesStore, { addCuiteStore } from "../../../store/addCuite";

type TitlesListProps = {
	mediaValidate: boolean;
};

export default function TitlesList({ mediaValidate }: TitlesListProps) {
	const cuites = useNewCuitesStore((state) => state.cuites);

	if (mediaValidate) {
		return (
			<ScrollView
				className=""
				horizontal
				showsHorizontalScrollIndicator={false}
			>
				{cuites?.titles?.map((tag) => (
					<TouchableOpacity
						key={tag}
						className={`rounded-xl border border-text bg-bigGray mr-1 ${
							tag === cuites.title ? "bg-secondary" : ""
						}`}
						onPress={() => addCuiteStore.setNewCuite({ ...cuites, title: tag })}
					>
						<Text className="m-[5px] text-white text-[18px] font-black">
							{tag}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
		);
	}
}
