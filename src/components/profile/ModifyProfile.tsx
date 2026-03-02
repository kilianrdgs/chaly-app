import { useState } from "react";
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import modifyBackgroundName from "../../api/users/modifyBackgroundName.api";
import modifyDescription from "../../api/users/modifyDescriptionProfile.api";
import useUserStore from "../../store/user.store";
import {
	type GradientName,
	normalizeBgName,
} from "../../utils/backgroundProfile";
import MyIcon from "../icons/MyIcon";
import ChooseColorProfile from "./ChooseColorProfile";

export default function ModifyProfile() {
	const { user, setUser } = useUserStore();
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState(user?.description ?? "");

	const currentBg: GradientName = normalizeBgName(user?.backgroundName);
	const [bgSlug, setBgSlug] = useState<GradientName>(currentBg);

	const [loading, setLoading] = useState(false);
	const insets = useSafeAreaInsets();
	const MAX = 60;

	function openEditor() {
		setDraft(user?.description ?? "");
		setBgSlug(normalizeBgName(user?.backgroundName));
		setOpen(true);
	}

	const nextBio = (draft || "").trim();
	const bioChanged = nextBio !== (user?.description ?? "").trim();
	const colorChanged = bgSlug !== currentBg;
	const bioValid = nextBio.length > 0 && nextBio.length <= MAX;
	const disabled =
		loading || (!bioChanged && !colorChanged) || (bioChanged && !bioValid);

	async function onSave() {
		if (loading) return;
		const tasks: Promise<{ success: boolean; message?: string }>[] = [];
		if (bioChanged) tasks.push(modifyDescription(nextBio));
		if (colorChanged) tasks.push(modifyBackgroundName(bgSlug));

		if (!tasks.length) {
			setOpen(false);
			return;
		}

		try {
			setLoading(true);
			const results = await Promise.all(tasks);
			const fail = results.find((r) => !r?.success);
			if (fail) {
				Alert.alert("Erreur", fail?.message || "Mise à jour impossible");
				return;
			}
			if (!user) {
				setOpen(false);
				return;
			}

			setUser({
				...user,
				...(bioChanged ? { description: nextBio } : {}),
				...(colorChanged ? { backgroundName: bgSlug } : {}),
			});

			setOpen(false);
		} catch {
			Alert.alert("Erreur réseau", "Réessaie plus tard.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<TouchableOpacity
				onPress={openEditor}
				activeOpacity={0.8}
				className="absolute z-10 p-2 rounded-full right-2"
			>
				<MyIcon name="edit" size={24} color="white" />
			</TouchableOpacity>

			<Modal
				visible={open}
				animationType="slide"
				presentationStyle="pageSheet"
				onRequestClose={() => !loading && setOpen(false)}
				transparent={false}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={{ flex: 1, backgroundColor: "black" }}
				>
					<TouchableWithoutFeedback
						onPress={Keyboard.dismiss}
						accessible={false}
					>
						<View
							className="flex-1 px-4 pt-4 bg-black"
							style={{ paddingBottom: insets.bottom + 12 }}
						>
							<View className="flex-row items-center justify-between mb-4">
								<TouchableOpacity
									onPress={() => !loading && setOpen(false)}
									className="p-2"
								>
									<Text className="text-white">Annuler</Text>
								</TouchableOpacity>
								<Text className="text-base text-white font-poppins">
									Personnaliser le profil
								</Text>
								<TouchableOpacity
									onPress={onSave}
									disabled={disabled}
									className="p-2"
								>
									<Text
										className={disabled ? "text-neutral-500" : "text-white"}
									>
										{loading ? "…" : "Enregistrer"}
									</Text>
								</TouchableOpacity>
							</View>

							<View className="p-3 bg-neutral-900 rounded-2xl">
								<TextInput
									multiline
									value={draft}
									onChangeText={(t) => setDraft(t.slice(0, MAX))}
									placeholder={`Dis un truc sympa (max ${MAX})`}
									placeholderTextColor="#666"
									className="text-white min-h-[120px]"
									editable={!loading}
									maxLength={MAX}
									returnKeyType="done"
									onSubmitEditing={onSave}
								/>
								<View className="flex-row justify-end">
									<Text className="text-xs text-neutral-400">
										{draft.length}/{MAX}
									</Text>
								</View>
							</View>

							<ChooseColorProfile
								value={currentBg}
								onChange={(slug) => setBgSlug(slug)}
							/>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAvoidingView>
			</Modal>
		</>
	);
}
