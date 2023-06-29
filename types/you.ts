import { JwtPayload } from 'jsonwebtoken';

export interface RootResponse {
	items: Item[];
}

export interface Item {
	kind: string;
	etag: string;
	id: Id;
	snippet: Snippet;
}

export interface Id {
	kind: string;
	videoId: string;
}

export interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: string;
	liveBroadcastContent: string;
	publishTime: string;
}

export interface Thumbnails {
	default: Default;
	medium: Medium;
	high: High;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface Medium {
	url: string;
	width: number;
	height: number;
}

export interface High {
	url: string;
	width: number;
	height: number;
}

////*************** */ YOU TUBE DATA BY ID types*************////////////////////////
export interface RootResVideoById {
	kind: string;
	etag: string;
	items: VideoByIdType[];
	pageInfo: PageInfo;
}

export interface VideoByIdType {
	kind: string;
	etag: string;
	id: string;
	snippet: Snippet;
	contentDetails: ContentDetails;
	statistics: Statistics;
}

export interface Snippet {
	publishedAt: string;
	channelId: string;
	title: string;
	description: string;
	thumbnails: Thumbnails;
	channelTitle: string;
	tags: string[];
	categoryId: string;
	liveBroadcastContent: string;
	defaultLanguage: string;
	localized: Localized;
	defaultAudioLanguage: string;
}

export interface Thumbnails {
	default: Default;
	medium: Medium;
	high: High;
	standard: Standard;
	maxres: Maxres;
}

export interface Default {
	url: string;
	width: number;
	height: number;
}

export interface Medium {
	url: string;
	width: number;
	height: number;
}

export interface High {
	url: string;
	width: number;
	height: number;
}

export interface Standard {
	url: string;
	width: number;
	height: number;
}

export interface Maxres {
	url: string;
	width: number;
	height: number;
}

export interface Localized {
	title: string;
	description: string;
}

export interface ContentDetails {
	duration: string;
	dimension: string;
	definition: string;
	caption: string;
	licensedContent: boolean;
	contentRating: ContentRating;
	projection: string;
}

export interface ContentRating {}

export interface Statistics {
	viewCount: string;
	likeCount: string;
	favoriteCount: string;
	commentCount: string;
}

export interface PageInfo {
	totalResults: number;
	resultsPerPage: number;
}

export interface DecodedTokenTypes {
	issuer: string;
	publicAddress: string;
	email: string;
	oauthProvider: any;
	phoneNumber: any;
	wallets: any[];
	iat: number;
	exp: number;
	'https://hasura.io/jwt/claims': HttpsHasuraIoJwtClaims;
}

export interface HttpsHasuraIoJwtClaims {
	'x-hasura-default-role': string;
	'x-hasura-allowed-roles': string[];
	'x-hasura-user-id': string;
}
