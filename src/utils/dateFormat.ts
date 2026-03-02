export const dateFormat = (date: Date) => {
	return date.toLocaleDateString("fr-FR", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

export const getRelativeTime = (dateString: string) => {
	const date = new Date(dateString);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	const diffMinutes = Math.floor(diffSeconds / 60);
	const diffHours = Math.floor(diffMinutes / 60);
	const diffDays = Math.floor(diffHours / 24);

	if (diffSeconds < 60) {
		return "à l'instant";
	}
	if (diffMinutes < 60) {
		return `il y a ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
	}
	if (diffHours < 24) {
		return `il y a ${diffHours} heure${diffHours > 1 ? "s" : ""}`;
	}
	if (diffDays < 7) {
		return `il y a ${diffDays} jour${diffDays > 1 ? "s" : ""}`;
	}
	return `le ${date.getDate()} ${getMonthName(date.getMonth())}`;
};

function getMonthName(monthIndex: number): string {
	const months = [
		"janvier",
		"février",
		"mars",
		"avril",
		"mai",
		"juin",
		"juillet",
		"août",
		"septembre",
		"octobre",
		"novembre",
		"décembre",
	];
	return months[monthIndex];
}
