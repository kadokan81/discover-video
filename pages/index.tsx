import type { NextPage } from 'next';
import Head from 'next/head';

import styles from '../styles/Home.module.css';

import Banner from '../components/banner/banner';
import Navbar from '../components/navbar/navbar';
import Card from '../components/card/card';
import SectionCards, { VideoTypes } from '../components/card/section-cards';
import { getVideos } from '../lib/videos';

import { useEffect } from 'react';

// ];
// This gets called on every request
export async function getServerSideProps() {
	const videosDisney = await getVideos('disney trailer');
	const travelVideos = await getVideos('travel');
	const reactVideos = await getVideos('react.js  ');
	return { props: { videosDisney, travelVideos, reactVideos } };
}

type HomePageProps = {
	videosDisney: VideoTypes[];
	travelVideos: VideoTypes[];
	reactVideos: VideoTypes[];
};

const Home: NextPage<HomePageProps> = ({
	videosDisney,
	travelVideos,
	reactVideos,
}) => {
	return (
		<div className={styles.container}>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Generated by create next app' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Navbar />
			<Banner
				title='Clifford the red dog'
				subTitle='a very cute dog'
				imgUrl='/static/clifford.webp'
				videoId='4zH5iYM4wJo'
			/>

			<SectionCards
				videos={videosDisney}
				title='Disney List'
				size='large'
				shouldScale={true}
				shouldWrap={false}
			/>
			<SectionCards
				videos={travelVideos}
				title='Travel'
				size='medium'
				shouldScale={true}
				shouldWrap={false}
			/>
			<SectionCards
				videos={reactVideos}
				title='Popular Videos'
				size='small'
				shouldScale={false}
				shouldWrap={true}
			/>

			<footer className={styles.footer}></footer>
		</div>
	);
};

export default Home;

// type youTube = {
// 	"kind": "youtube#searchResult",
// 	"etag": etag,
// 	"id": {
// 	  "kind": string,
// 	  "videoId": string,
// 	  "channelId": string,
// 	  "playlistId": string
// // 	},
// 	"snippet": {
// 	  "publishedAt": datetime,
// 	  "channelId": string,
// 	  "title": string,
// 	  "description": string,
// 	  "thumbnails": {
// 		(key): {
// 		  "url": string,
// 		  "width": unsigned integer,
// 		  "height": unsigned integer
// 		}
// 	  },
// 	  "channelTitle": string,
// 	  "liveBroadcastContent": string
// 	}
//   }
