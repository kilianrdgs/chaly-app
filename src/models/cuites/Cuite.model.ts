interface BaseCuite {
	title: string | null;
	description: string | null;
	date: Date | null;
	location: { latitude: number; longitude: number; address?: string } | null;
	confidentiality: number;
	userPhoto?: string | null;
}

export interface NewCuite extends BaseCuite {
	media: Media | null;
	titles?: string[];
	replyTo?: string | null;
	lastTitle?: string | null;
	lastDescription?: string | null;
}

interface Media {
	id: number;
	type: string;
	uri: string;
}

export interface Cuite extends BaseCuite {
	urlPicture?: string;
	Id: number;
	UserToken: string;
	Emplacement: { Latitude: number; Longitude: number };
	CuiteDate: Date;
	LocationRate: number;
	LikeCount: number | null;
}

export enum confidentialityType {
	PUBLIC = "Publique (par default)",
	FRIENDS = "Amis seulement",
	TEAM = "Clan uniquemen",
	PRIVATE = "Seulement moi",
}
