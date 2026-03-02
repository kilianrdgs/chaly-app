import Svg, { Circle } from "react-native-svg";

export default function ButtonPicture() {
	return (
		<Svg height="100" width="100">
			<Circle
				cx="50"
				cy="50"
				r="40"
				stroke="white"
				strokeWidth="6"
				fill="none"
			/>
		</Svg>
	);
}
