import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import {
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ButtonSend from "../components/login/ButtonSend";
import EnterCodeInput from "../components/login/EnterCodeInput";
import EnterPhoneInput from "../components/login/EnterPhone";
import useAuthStore from "../store/auth.store";

export default function LoginPage() {
	const insets = useSafeAreaInsets();
	const verification = useAuthStore((state) => state.verification);
	const setPhone = useAuthStore((state) => state.setPhone);
	const setVerification = useAuthStore((state) => state.setVerification);

	const handlePress = () => {
		if (verification) {
			setVerification(false);
			setPhone("");
		}
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View
					className="flex-1 bg-black -mb-[30px] px-4"
					style={{
						paddingTop: insets.top,
						paddingBottom: insets.bottom,
					}}
				>
					<TouchableOpacity onPress={handlePress}>
						<FontAwesome
							name="chevron-left"
							size={32}
							color={verification ? "#8B8B8B" : "transparent"} // colors.gray / transparent
						/>
					</TouchableOpacity>

					<View className="w-full">
						<Image
							source={require("../assets/images/logo2-nobg.png")}
							className="w-[140px] h-[140px]"
							style={{ resizeMode: "contain", margin: "auto" }}
						/>
					</View>

					<View className="w-full mt-[20px]">
						<Text className="text-white font-black text-[18px] text-center">
							{!verification ? "numéro de téléphone ?" : "Vérifie ton numéro"}
						</Text>
					</View>

					<View
						className={`flex-row gap-2 mt-4 mx-auto ${
							!verification ? "w-4/5" : "w-2/5"
						}`}
					>
						{!verification && (
							<View className="self-center px-3 py-2 border rounded-lg bg-bigGray border-secondary">
								<Text className="text-white text-[16px]">🇫🇷 +33</Text>
							</View>
						)}
						{!verification ? <EnterPhoneInput /> : <EnterCodeInput />}
					</View>

					<View className="w-full mt-[30px]">
						<Text className="text-gray text-center font-poppins text-[14px] leading-[22px]">
							En créant un compte, tu acceptes notre{" "}
							<Text
								className="text-white underline"
								onPress={() => router.push("/infoScreen?type=rgpd")}
							>
								politique de confidentialité
							</Text>{" "}
							et nos{" "}
							<Text
								className="text-white underline"
								onPress={() => router.push("/infoScreen?type=cgu")}
							>
								conditions d’utilisation
							</Text>
							.
						</Text>
					</View>

					<ButtonSend />
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
}
