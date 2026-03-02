type StopFn = () => void;

export function startCountdown(
	seconds: number,
	onTick: (remaining: number) => void,
	onDone?: () => void,
): StopFn {
	let remaining = Math.max(0, Math.floor(seconds));
	onTick(remaining);

	const id = setInterval(() => {
		remaining -= 1;
		onTick(remaining);
		if (remaining <= 0) {
			clearInterval(id);
			onDone?.();
		}
	}, 1000);

	return () => clearInterval(id);
}
