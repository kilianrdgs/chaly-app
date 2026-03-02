import * as Haptics from "expo-haptics";
import { type Route, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import MyIcon from "../../icons/MyIcon";

interface HeaderBtnProps {
	iconName: string;
	route?: Route;
}

export default function HeaderBtn({ iconName, route }: HeaderBtnProps) {
	const router = useRouter();

	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		if (iconName === "friends") {
			router.push("/friends");
		}

		if (iconName === "target") {
			router.push("/challenge");
		}

		if (route) {
			router.push(route);
		}
		if (iconName === "chevron-left") {
			router.back();
		}
	};

	return (
		<TouchableOpacity onPress={handlePress}>
			<MyIcon name={iconName} size={25} color="white" />
		</TouchableOpacity>
	);
}
