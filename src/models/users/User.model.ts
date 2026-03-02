export interface User {
	username: string;
	email?: string;
	xpTotal?: number;
	isAuthenticated: boolean;
	profilePicture?: string | null;
	currentLevel: number;
	percentageToNextLevel: number;
	totalCuites: number;
	streakDays: number;
	moderator: boolean;
	certified: boolean;
	description: string;
	backgroundName: string | null;
}
