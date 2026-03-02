import debounce from "lodash.debounce";
import { useCallback, useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import verifyUsername from "../api/auth/verifyUsername.api";
import ButtonSendSpeudo from "../components/login/ButtonSendPseudo";
import useAuthStore from "../store/auth.store";

export default function CreateUsername() {
	const insets = useSafeAreaInsets();
	const username = useAuthStore((state) => state.username);
	const setUsername = useAuthStore((state) => state.setUsername);
	const setVerificationUsername = useAuthStore(
		(state) => state.setVerificationUsername,
	);
	const [textIndicator, setTextIndicator] = useState("");

	const checkAndSetUsernameStatus = async (text: string) => {
		if (text.length < 1) {
			setTextIndicator("");
			return;
		}

		try {
			const res = await verifyUsername(text);
			if (!res) return console.log("erreur requete vide");
			setTextIndicator(res?.data);
			if (res.status === 200) {
				setVerificationUsername(true);
			}
		} catch (err) {
			console.error("Erreur vérification pseudo", err);
			setTextIndicator("Erreur serveur");
		}
	};

	const debouncedCheck = useCallback(
		debounce(checkAndSetUsernameStatus, 1000),
		[],
	);

	const handleUsernameChange = (text: string) => {
		setUsername(text);
		debouncedCheck(text);
	};

	return (
		<KeyboardAvoidingView
			className="flex-1"
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					className="flex-1 px-4 -mb-8 bg-black"
					style={{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
					}}
				>
					<Text className="text-white font-black text-[24px] text-center mt-[100px]">
						CHOISIS UN PSEUDO
					</Text>

					<TextInput
						placeholder="pseudo"
						className="bg-darkGray border border-secondary rounded-lg w-1/2 mt-10 px-5 h-[45px] text-white text-[20px] font-black text-center self-center"
						value={username}
						maxLength={10}
						onChangeText={handleUsernameChange}
						placeholderTextColor="#666"
					/>

					<Text className="text-white font-poppins text-[18px] text-center mt-5">
						{textIndicator}
					</Text>

					<ButtonSendSpeudo />
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
