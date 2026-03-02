export const BG_MAP = {
	black: ["#000000", "#000000"] as const,
	pink: ["#E37FB1", "#BA2D6D", "#160A12"] as const,
	indigo: ["#7B55C7", "#2A4A8F", "#0B1020"] as const,
	teal: ["#55C7B9", "#0C7F7F", "#0A1616"] as const,
	rose: ["#E05A74", "#A31636", "#170A0D"] as const,
	blue: ["#4A76D8", "#0C8DC7", "#0A0E1A"] as const,
	mint: ["#58C79F", "#0FA574", "#0A1310"] as const,

	ultraviolet: ["#B08EEB", "#6E3ADD", "#0D0A13"] as const,
	electricCyan: ["#7CD9E8", "#079BB4", "#08121A"] as const,
	laserLime: ["#92D235", "#1FA556", "#0B1208"] as const,
	sunset: ["#E18F1A", "#A61B3A", "#0F0A0A"] as const,
	amber: ["#E7B342", "#B9690C", "#130E08"] as const,
	miami: ["#E07AAE", "#089CB6", "#0B1020"] as const,
	candyPeach: ["#F1B37B", "#E0691A", "#140A08"] as const,
	plumCandy: ["#E07AAE", "#6F2BB9", "#120A14"] as const,
} as const;

export type GradientName = keyof typeof BG_MAP;
export type GradientTuple = readonly [string, string, ...string[]];

export function getGradientByName(
	name?: string | null,
	fallback: GradientName = "black",
): GradientTuple {
	if (!name) return BG_MAP[fallback];
	const key = name as GradientName;
	return BG_MAP[key] ?? BG_MAP[fallback];
}

export function isGradientName(x: unknown): x is GradientName {
	return (
		typeof x === "string" && Object.prototype.hasOwnProperty.call(BG_MAP, x)
	);
}

export function normalizeBgName(x?: string | null): GradientName {
	return isGradientName(x) ? x : "black";
}
