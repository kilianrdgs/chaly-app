import { router } from "expo-router";
import {
	Keyboard,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import modifyPseudo from "../../api/users/modifyPseudo.api";
import colors from "../../assets/colors";
import useAuthStore from "../../store/auth.store";

export default function ButtonSendSpeudo() {
	const username = useAuthStore((state) => state.username);
	const verificationUsername = useAuthStore(
		(state) => state.verificationUsername,
	);
	const setVerificationUsername = useAuthStore(
		(state) => state.setVerificationUsername,
	);

	const handlePress = async () => {
		if (username.length >= 4 && verificationUsername === true) {
			Keyboard.dismiss();
			const response = await modifyPseudo(username);

			if (response?.success === true) {
				setVerificationUsername(false);
				const unsubscribe = Keyboard.addListener("keyboardDidHide", () => {
					router.replace("/");
					unsubscribe.remove();
				});
			}
		} else {
			console.log("erreur");
		}
	};

	return (
		<View style={styles.buttonWrapper}>
			<TouchableOpacity onPress={handlePress}>
				<Text style={styles.button}>CONTINUER</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	buttonWrapper: {
		marginTop: "auto",
		marginBottom: 50,
		alignItems: "center",
	},
	button: {
		backgroundColor: colors.secondary,
		color: colors.black,
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 10,
		fontSize: 16,
		fontFamily: "Montserrat-Black",
	},
	buttonOn: {
		backgroundColor: colors.secondary,
	},
	buttonOff: {
		backgroundColor: colors.bigGray,
	},
	info: {
		color: "red",
		fontSize: 18,
		marginBottom: 2,
		textAlign: "center",
	},
});
