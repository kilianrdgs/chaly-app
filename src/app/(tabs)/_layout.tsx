import * as Haptics from "expo-haptics";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import getCuitesList from "../../api/cuites/getCuitesList.api";
import colors from "../../assets/colors";
import MyIcon from "../../components/icons/MyIcon";
import { useCuitesScrollStore } from "../../store/cuites.store";
import { usePublicProfileStore } from "../../store/publicProfile.store";

export default function TabLayout() {
	const { setProfileMode } = usePublicProfileStore();
	const { reset } = useCuitesScrollStore();

	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarActiveTintColor: colors.white,
				tabBarInactiveTintColor: "gray",
				tabBarStyle: {
					position: "absolute",
					bottom: 0,
					backgroundColor: colors.black,
					borderTopWidth: 0,
					paddingTop: 5,
					borderTopRightRadius: 25,
					borderTopLeftRadius: 25,
					height: 80,
					shadowColor: colors.gray,
					shadowOffset: { width: 0, height: 0 },
					shadowOpacity: 1,
					shadowRadius: 1,
				},
			}}
		>
			<Tabs.Screen
				name="scroll"
				options={{
					title: "Scroll",
					tabBarIcon: ({ color }) => (
						<View style={{ marginBottom: -10, marginHorizontal: -10 }}>
							<View style={{ alignItems: "center" }}>
								<MyIcon name="flame" size={22} color={color} />
							</View>
							<Text style={{ color: color, textAlign: "center" }}>Feed</Text>
						</View>
					),
					headerShown: false,
				}}
				listeners={{
					tabPress: async () => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
						const {
							setCuites,
							setLoading,
							reset,
							shouldRefetch,
							setLastFetched,
							setHasFetched,
						} = useCuitesScrollStore.getState();

						setProfileMode("scroll");

						const TTL_SCROLL_FEED = 120_000;
						if (!shouldRefetch(TTL_SCROLL_FEED)) {
							return;
						}

						setLoading(true);
						reset();

						try {
							const result = await getCuitesList(6, null, "scroll", "");
							if (result) {
								setCuites(result.cuites, result.nextCursor);
								setHasFetched(true);
								setLastFetched(Date.now());
							}
						} catch (error) {
							console.error(
								"Erreur lors du rafraîchissement des cuites :",
								error,
							);
						} finally {
							setLoading(false);
						}
					},
				}}
			/>

			<Tabs.Screen
				name="index"
				options={{
					title: "Ajouter",
					tabBarIcon: ({ color }) => (
						<View style={{ marginBottom: -17, marginHorizontal: -10 }}>
							<View
								style={{
									borderColor: colors.secondary,
									borderWidth: 3,
									borderRadius: 50,
									backgroundColor: colors.bigGray,
									shadowColor: colors.secondary,
									shadowOffset: { width: 0, height: 0 },
									shadowOpacity: 0.8,
									shadowRadius: 4,

									elevation: 10,
								}}
							>
								<MyIcon name="camera" size={50} color={colors.white} />
							</View>
						</View>
					),
					headerShown: false,
				}}
				listeners={{
					tabPress: async () => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					},
				}}
			/>

			<Tabs.Screen
				name="profile"
				options={{
					title: "profil",
					tabBarIcon: ({ color }) => (
						<View style={{ marginBottom: -10, marginHorizontal: -10 }}>
							<View style={{ alignItems: "center" }}>
								<MyIcon name="user" size={25} color={color} />
							</View>
							<Text style={{ color: color, textAlign: "center" }}>Profil</Text>
						</View>
					),
					headerShown: false,
				}}
				listeners={{
					tabPress: async () => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					},
				}}
			/>
		</Tabs>
	);
}
