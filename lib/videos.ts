import { VideoTypes } from '../components/card/section-cards';
import { RootResVideoById, RootResponse } from '../types/you';

export const getVideos = async (
	search: string = 'disney'
): Promise<VideoTypes[] | []> => {
	const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

	try {
		const response = await fetch(
			`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=rating&q=${search}%20trailer&key=${GOOGLE_API_KEY}`
		);

		const videoData: RootResponse = await response.json();

		return videoData.items.map((video) => ({
			title: video.snippet.title,
			imgUrl: video.snippet.thumbnails.high.url,
			id: video.id.videoId,
		}));
	} catch (error) {
		console.error('error message:' + error);
		return [];
	}
};

// GET https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=Ks-_Mh1QhMc&key=[YOUR_API_KEY] HTTP/1.1

// Authorization: Bearer [YOUR_ACCESS_TOKEN]
// Accept: application/json

export const getVideosBiId = async (id: string): Promise<VideoTypes | {}> => {
	const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

	try {
		const response = await fetch(
			`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${GOOGLE_API_KEY}`
		);

		const videoData: RootResVideoById = await response.json();

		return {
			title: videoData.items[0].snippet.title,
			imgUrl: videoData.items[0].snippet.thumbnails.high.url,
			description: videoData.items[0].snippet.description,
			publishedAt: videoData.items[0].snippet.publishedAt,
			id: videoData.items[0].id,
			viewCount: videoData.items[0].statistics.viewCount,
			channelTitle: videoData.items[0].snippet.channelTitle,
		};
	} catch (error) {
		console.error('error message:' + error);
		return {};
	}
};
