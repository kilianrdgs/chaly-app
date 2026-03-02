export interface SettingContent {
	action?: string;
	text: string;
}

export interface SettingsItem {
	name: string;
	icon: string;
	content: SettingContent;
}

export interface SettingsGroup {
	groupName: string;
	items: SettingsItem[];
}

export interface SettingsData {
	title: string;
	groups: SettingsGroup[];
}

export const settingsData: SettingsData = {
	title: "OPTIONS",
	groups: [
		{
			groupName: "GÉNÉRAL",
			items: [
				{
					name: "Intelligence Artificielle",
					icon: "magic",
					content: {
						action: "configureAi",
						text: "Personnalité de l'ia",
					},
				},
				{
					name: "Gérer les autorisations",
					icon: "shield",
					content: {
						action: "openAuthorisation",
						text: "autorisations",
					},
				},
			],
		},
		{
			groupName: "COMPTE",
			items: [
				{
					name: "Déconnexion",
					icon: "sign-out",
					content: {
						action: "disconnect",
						text: "contenu de la page FAQ",
					},
				},
			],
		},
	],
};
