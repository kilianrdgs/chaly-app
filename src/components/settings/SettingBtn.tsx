import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import invalidateToken from "../../api/users/invalidateToken.api";
import colors from "../../assets/colors";
import { authStore } from "../../store/auth.store";
import { userStore } from "../../store/user.store";
import { trackDeconnection } from "../../utils/mixpanel";
import { useToast } from "../commons/toast/Toast";

export default function SettingBtn({
	optionBtn,
	textBtn,
	action,
}: {
	optionBtn: string;
	textBtn: string;
	action?: string;
}) {
	const router = useRouter();
	const { openToast } = useToast();

	const handlePress = () => {
		if (action === "disconnect") {
			Alert.alert(
				"Déconnexion",
				"Tu veux déjà nous quitter ? 🥹",
				[
					{
						text: "Non dsl",
						style: "cancel",
					},
					{
						text: "Oui salut",
						style: "destructive",
						onPress: async () => {
							await invalidateToken();
							userStore.clearUser();
							authStore.reset();
							router.replace("/loginPage");
							trackDeconnection();
							openToast("info", "Tu vas nous manquer 🥺");
						},
					},
				],
				{ cancelable: true },
			);
			return;
		}
		if (action === "configureAi") {
			return router.push("/infoScreen?type=configureAi");
		}
		if (action === "openAuthorisation") {
			return router.push("/infoScreen?type=openAuthorisation");
		}
		openToast("warning", "en développement");
	};

	return (
		<TouchableOpacity style={styles.button} onPress={handlePress}>
			<FontAwesome
				name={optionBtn as keyof typeof FontAwesome.glyphMap}
				size={25}
				color={colors.white}
			/>
			<Text style={styles.buttonText}>{textBtn}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: colors.bigGray,
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 12,
		width: "100%",
		alignItems: "center",
		display: "flex",
		flexDirection: "row",
		gap: 12,
	},

	buttonText: {
		color: colors.white,
		fontSize: 17,
		fontWeight: "bold",
		fontFamily: "Poppins-Regular",
		paddingHorizontal: 5,
	},
});
