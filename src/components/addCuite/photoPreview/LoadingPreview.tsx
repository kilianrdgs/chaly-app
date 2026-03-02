import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

const loadingMessages = [
	"Tonton cherche l'inspi... 😏💡",
	"Il hésite entre deux vannes... 🤔🧠",
	"Ça sent la masterclass imminente 🔥📸",
	"Il relit ses blagues... trois fois. 🧐✍️",
	"Tonton a peur de flop 🥸",
	"Il trie ses punchlines. ✂️📝",
	"Il se demande si c’est pas trop... 🫣",
];

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export default function LoadingPreview() {
	const [shuffledMessages, setShuffledMessages] = useState(() =>
		shuffleArray(loadingMessages),
	);
	const [currentIndex, setCurrentIndex] = useState(0);
	const opacity = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		const interval = setInterval(() => {
			Animated.timing(opacity, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start(() => {
				const nextIndex = currentIndex + 1;
				if (nextIndex >= shuffledMessages.length) {
					setShuffledMessages(shuffleArray(loadingMessages));
					setCurrentIndex(0);
				} else {
					setCurrentIndex(nextIndex);
				}
				Animated.timing(opacity, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}).start();
			});
		}, 3000);

		return () => clearInterval(interval);
	}, [currentIndex, shuffledMessages, opacity]);

	return (
		<View
			className="absolute left-1/2 bottom-1/2"
			style={{ transform: "translate(-50%)" }}
		>
			<Animated.Text
				className="text-white text-center text-[18px] font-black font-montserrat"
				style={{ opacity }}
			>
				{shuffledMessages[currentIndex]}
			</Animated.Text>
		</View>
	);
}
