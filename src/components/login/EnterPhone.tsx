import { StyleSheet, TextInput } from "react-native";
import colors from "../../assets/colors";
import useAuthStore from "../../store/auth.store";

export default function EnterPhoneInput() {
	const phone = useAuthStore((state) => state.phone);
	const setPhone = useAuthStore((state) => state.setPhone);

	const handlePhoneChange = (text: string) => {
		let digitsOnly = text.replace(/\D/g, "");
		if (digitsOnly.length === 1 && !/[067]/.test(digitsOnly[0])) {
			return;
		}

		if (
			digitsOnly.length > 0 &&
			(digitsOnly[0] === "6" || digitsOnly[0] === "7")
		) {
			digitsOnly = `0${digitsOnly}`;
		}

		const limited = digitsOnly.slice(0, 10);
		const formatted = limited.replace(/(\d{2})(?=\d)/g, "$1 ");

		setPhone(formatted);
	};

	return (
		<TextInput
			placeholder={". .  . .  . .  . .  . ."}
			keyboardType="phone-pad"
			style={styles.inputNum}
			value={phone}
			maxLength={14}
			onChangeText={handlePhoneChange}
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
	},
});
