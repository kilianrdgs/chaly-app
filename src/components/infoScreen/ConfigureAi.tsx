import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import colors from "../../assets/colors";

const PERSONALITIES = [
	{ key: "default", label: "Taquin 🤣 (par défaut)" },
	{ key: "poetique", label: "Poétique ✏️" },
	{ key: "aigri", label: "Aigri 🙁" },
	{ key: "dragueur", label: "Dragueur 😏" },
];

const STORAGE_KEY = "selectedPersonality";

export default function ConfigureAi() {
	const [selected, setSelected] = useState("default");

	useEffect(() => {
		const loadPersonality = async () => {
			const stored = await AsyncStorage.getItem(STORAGE_KEY);
			if (stored) {
				setSelected(stored);
			}
		};
		loadPersonality();
	}, []);

	const handlePress = async (key: string) => {
		setSelected(key);
		await AsyncStorage.setItem(STORAGE_KEY, key);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>CONFIGURATION IA</Text>
			<Text style={styles.txt}>Choix de personnalité</Text>

			{PERSONALITIES.map((item) => (
				<TouchableOpacity
					key={item.key}
					style={[
						styles.option,
						selected === item.key && styles.optionSelected,
					]}
					onPress={() => handlePress(item.key)}
				>
					<Text
						style={[
							styles.optionText,
							selected === item.key && styles.optionTextSelected,
						]}
					>
						{item.label}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 20,
		paddingVertical: 30,
	},
	title: {
		fontFamily: "Montserrat-Black",
		color: colors.white,
		fontSize: 24,
		textAlign: "center",
		marginBottom: 10,
	},
	txt: {
		color: colors.white,
		fontSize: 20,
		lineHeight: 24,
		marginBottom: 25,
		marginTop: 50,
		fontFamily: "Poppins-Regular",
		textAlign: "center",
	},
	option: {
		backgroundColor: colors.bigGray,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginBottom: 12,
	},
	optionSelected: {
		backgroundColor: colors.secondary,
	},
	optionText: {
		color: colors.white,
		fontFamily: "Poppins-Regular",
		fontSize: 16,
	},
	optionTextSelected: {
		fontWeight: "bold",
	},
});
