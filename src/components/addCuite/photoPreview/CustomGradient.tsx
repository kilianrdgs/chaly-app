import { LinearGradient } from "expo-linear-gradient";

export default function CustomGradient() {
	return (
		<LinearGradient
			colors={[
				"rgba(0,0,0,1)",
				"rgba(0,0,0,0.82)",
				"rgba(0,0,0,0.65)",
				"rgba(0,0,0,0.1)",
				"transparent",
			]}
			start={{ x: 0, y: 1 }}
			end={{ x: 0, y: 0 }}
			style={{
				bottom: 0,
				position: "absolute",
				left: 0,
				right: 0,
				height: 250,
			}}
		/>
	);
}
