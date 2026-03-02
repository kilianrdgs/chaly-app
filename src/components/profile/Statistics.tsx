import { View } from "react-native";
import { usePublicProfileStore } from "../../store/publicProfile.store";
import useUserStore from "../../store/user.store";
import StatCard from "./StatCard";

export default function Statistics({
	isOwnProfile,
}: {
	isOwnProfile?: boolean;
}) {
	const { user } = useUserStore(); // mon profil connecté
	const publicProfile = usePublicProfileStore(); // profil des autres

	return (
		<View className="w-full px-4 mt-5 mb-7">
			<View className="flex-row justify-between">
				<StatCard
					emoji="📸"
					value={
						isOwnProfile
							? (user?.totalCuites ?? 0)
							: (publicProfile.totalCuites ?? 0)
					}
					label="Posts"
				/>
				<StatCard
					emoji="🚀"
					value={
						isOwnProfile
							? (user?.currentLevel ?? 0)
							: (publicProfile.user?.currentLevel ?? 0)
					}
					label="Niveau"
				/>
				<StatCard
					emoji="🔥"
					value={
						isOwnProfile
							? (user?.streakDays ?? 0)
							: (publicProfile.streakDays ?? 0)
					}
					label="Streak"
				/>
			</View>
		</View>
	);
}
