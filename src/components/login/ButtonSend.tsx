import { router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	Keyboard,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

import requestCode from "../../api/auth/requestCode.api";
import verifyCode from "../../api/auth/verifyCode.api";
import colors from "../../assets/colors";
import useAuthStore from "../../store/auth.store";
import { startCountdown } from "../../utils/timer";

export default function ButtonSend() {
	const { phone, codeOtp, verification, blocked, setVerification, setBlocked } =
		useAuthStore();

	const [loading, setLoading] = useState(false);
	const [time, setTime] = useState<number>(0);

	const reset = useAuthStore((state) => state.reset);

	const canResend = verification && codeOtp.length < 6;
	const label = verification
		? canResend
			? time > 0
				? `Renvoyer le code (${time})`
				: "Renvoyer le code"
			: "Vérifier mon numéro"
		: "Envoyer le code";

	const disabled =
		loading ||
		blocked ||
		(!verification && phone.length !== 14) ||
		(canResend && time > 0) ||
		(!canResend && verification && codeOtp.length !== 6);

	const sendSms = async () => {
		setLoading(true);
		const res = await requestCode(phone);
		setLoading(false);
		if (!res.success) {
			setBlocked(true);
			return;
		}
		setVerification(true);
		startCountdown(60, (t) => setTime(t));
	};

	const handlePress = async () => {
		if (disabled) return;

		if (!verification) {
			await sendSms();
			return;
		}

		if (canResend) {
			await sendSms();
			return;
		}

		try {
			const response = await verifyCode(phone, codeOtp);
			Keyboard.dismiss();

			if (response.status === 201) {
				router.replace("/createUsername");
			} else {
				router.replace("/");
			}

			setTimeout(() => reset(), 300);
		} catch (err) {
			console.error("Erreur dans verifyCode:", err);
			Alert.alert("Oups", "Une erreur est survenue lors de la vérification.");
		}
	};

	return (
		<View style={styles.buttonWrapper}>
			{blocked && (
				<View>
					<Text className="mb-2 text-center text-white">
						Numéro bloqué après trop de tentatives
					</Text>
					<Text className="mb-5 text-center text-white">
						contactez : contact@cuitemap.com
					</Text>
				</View>
			)}
			<TouchableOpacity disabled={disabled} onPress={handlePress}>
				<Text
					style={[styles.button, disabled ? styles.buttonOff : styles.buttonOn]}
				>
					{label}
				</Text>
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
});
