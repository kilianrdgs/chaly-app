import { StyleSheet, TextInput } from "react-native";
import colors from "../../assets/colors";
import useAuthStore from "../../store/auth.store";

export default function EnterCodeInput() {
	const codeOtp = useAuthStore((state) => state.codeOtp);
	const setCodeOtp = useAuthStore((state) => state.setCodeOtp);

	const handleCodeOtpChange = (text: string) => {
		setCodeOtp(text);
	};

	return (
		<TextInput
			placeholder={". . . . . ."}
			keyboardType="phone-pad"
			style={styles.inputNum}
			maxLength={6}
			value={codeOtp}
			onChangeText={handleCodeOtpChange}
		/>
	);
}

const styles = StyleSheet.create({
	inputNum: {
		backgroundColor: colors.darkGray,
		borderRadius: 10,
		flex: 1,
		paddingHorizontal: 10,
		color: colors.white,
		fontSize: 20,
		fontFamily: "Montserrat-Black",
		height: 40,
		textAlign: "center",
	},
});
