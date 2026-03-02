import { Text, View } from "react-native";
import HeaderBtn from "./HeaderBtn";

interface HeaderProps {
	title: string;
	isSettingPage?: boolean;
}

export default function Header({ title, isSettingPage }: HeaderProps) {
	return (
		<View className="flex-row h-[30] z-50 items-center w-full pb-2 bg-black border-b-2 border-darkGray">
			<View className="w-[20%] items-center">
				{!isSettingPage && <HeaderBtn iconName="target" />}
				{isSettingPage && <HeaderBtn iconName="chevron-left" />}
			</View>
			<View className="w-[60%] items-center justify-center">
				<Text className="text-white text-[15px] text-center font-montserrat px-1">
					{title}
				</Text>
			</View>
			<View className="flex-row gap-2">
				<View className="w-[20%] items-center">
					{!isSettingPage && <HeaderBtn iconName="friends" />}
				</View>
				<View className="w-[20%] items-center">
					{!isSettingPage && <HeaderBtn iconName="gear" route="/settings" />}
				</View>
			</View>
		</View>
	);
}
