import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import useNewCuitesStore from "../../../store/addCuite";
import { usePhotoState } from "../../../store/photoState.store";

type Props = {
	onMap?: boolean;
};

export default function BtnBack({ onMap }: Props) {
	const resetCuite = useNewCuitesStore((state) => state.resetCuite);
	const setValidate = usePhotoState((state) => state.setMediaValidate);

	const handleBack = () => {
		if (onMap === true) {
			router.back();
		}
		usePhotoState.getState().setHasTakenPhoto(false);
		setValidate(false);
		resetCuite();
	};

	return (
		<TouchableOpacity
			className="absolute top-[15px] left-[15px]"
			onPress={handleBack}
		>
			<FontAwesome name="close" size={38} color="white" />
		</TouchableOpacity>
	);
}
