import { View } from "react-native";
import BtnBack from "../components/addCuite/photoPreview/BtnBack";
import ViewMap from "../components/map/ViewMap";

export default function Home() {
	return (
		<View style={{ flex: 1 }}>
			<ViewMap />
			<BtnBack onMap={true} />
		</View>
	);
}
