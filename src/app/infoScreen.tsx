import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Authorisations from "../components/infoScreen/Authorisations";
import Cgu from "../components/infoScreen/Cgu";
import ConfigureAi from "../components/infoScreen/ConfigureAi";
import Rgpd from "../components/infoScreen/Rgpd";

export default function InfoScreen() {
	const { type } = useLocalSearchParams();

	return (
		<View className="flex-1 py-5 bg-bigGray">
			<SafeAreaView>{type === "rgpd" && <Rgpd />}</SafeAreaView>
			<SafeAreaView>{type === "cgu" && <Cgu />}</SafeAreaView>
			<SafeAreaView>{type === "configureAi" && <ConfigureAi />}</SafeAreaView>
			<SafeAreaView>
				{type === "openAuthorisation" && <Authorisations />}
			</SafeAreaView>
		</View>
	);
}
