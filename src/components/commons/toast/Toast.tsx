import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	Animated,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

type ToastType = "success" | "error" | "warning" | "info";
type ToastStatus = "loading" | "success";

interface ToastContextType {
	isVisible: boolean;
	toggleToast: () => void;
	openToast: (
		type: ToastType,
		message: string,
		options?: { mediaUri?: string; status?: ToastStatus },
	) => void;
	type: ToastType;
	message: string;
	mediaUri?: string;
	status?: ToastStatus;
}

const toastColors = {
	success: "#4CAF50",
	error: "#F44336",
	warning: "#FFC107",
	info: "#2196F3",
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [type, setType] = useState<ToastType>("info");
	const [message, setMessage] = useState<string>("");
	const [mediaUri, setMediaUri] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState<ToastStatus>("loading");

	const toggleToast = () => setIsVisible((prev) => !prev);

	const openToast = (
		type: ToastType,
		message: string,
		options?: { mediaUri?: string; status?: ToastStatus },
	) => {
		setType(type);
		setMessage(message);
		setMediaUri(options?.mediaUri);
		setStatus(options?.status || "loading");
		setIsVisible(true);
	};

	return (
		<ToastContext.Provider
			value={{
				isVisible,
				toggleToast,
				openToast,
				type,
				message,
				mediaUri,
				status,
			}}
		>
			{children}
			{isVisible && <Toast />}
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) throw new Error("useToast must be used within a ToastProvider");
	return context;
};

export function Toast() {
	const { toggleToast, message, type, mediaUri, status } = useToast();
	const opacityAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(opacityAnim, {
			toValue: 1,
			duration: 100,
			useNativeDriver: true,
		}).start();
	}, [opacityAnim]);

	useEffect(() => {
		if (status === "success") {
			const timer = setTimeout(() => {
				closeToast();
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [status]);

	const closeToast = () => {
		Animated.timing(opacityAnim, {
			toValue: 0,
			duration: 100,
			useNativeDriver: true,
		}).start(() => toggleToast());
	};

	return (
		<Animated.View
			className="absolute top-[50px] w-full z-[1000] items-center px-4"
			style={{ opacity: opacityAnim }}
		>
			<TouchableOpacity
				activeOpacity={1}
				onPress={closeToast}
				className="w-full max-w-[400px] h-[70px] rounded-xl border border-black bg-bigGray shadow-md flex-row items-center"
				style={{
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.4,
					shadowRadius: 4,
					elevation: 5,
				}}
			>
				{/* Trait de couleur à gauche */}
				<View
					className="h-full w-[6px] rounded-tl-xl rounded-bl-xl"
					style={{ backgroundColor: toastColors[type] }}
				/>

				{/* Contenu principal */}
				<View className="flex-row items-center flex-1 px-3">
					{mediaUri ? (
						<Image
							source={{ uri: mediaUri }}
							style={{
								width: 40,
								height: 40,
								borderRadius: 8,
								marginRight: 12,
								backgroundColor: "#444",
							}}
						/>
					) : (
						<View style={{ width: 40, height: 40, marginRight: 12 }} />
					)}

					<Text
						className="flex-1 text-base text-white font-poppins"
						numberOfLines={2}
					>
						{message}
					</Text>

					<View className="ml-2">
						{status === "loading" ? (
							<ActivityIndicator color={toastColors[type]} size="small" />
						) : (
							<Text
								className="text-base text-white font-poppins"
								style={{ color: toastColors[type] }}
							>
								{type === "success"
									? "✔️"
									: type === "error"
										? "❌"
										: type === "warning"
											? "⚠️"
											: "ℹ️"}
							</Text>
						)}
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
}

export default Toast;
