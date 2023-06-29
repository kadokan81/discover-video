import Head from 'next/head';
import NavBar from '../../components/navbar/navbar';
import SectionCards, { VideoTypes } from '../../components/card/section-cards';
import { StatsHasuraDataArray, getMyListVideos } from '../../lib/hasura';
import { getVideosBiId } from '../../lib/videos';
import { verifyToken } from '../../lib/utils';
import { GetServerSidePropsContext, NextPage } from 'next';

import styles from '../../styles/MyList.module.css';
export async function getServerSideProps(context: GetServerSidePropsContext) {
	const token = context.req.cookies.token || '';

	const userId = verifyToken(token);

	if (!userId) {
		return {
			props: {},
			redirect: {
				destination: '/login',
				permanent: false,
			},
		};
	}

	const watchedVideosIds = await getMyListVideos(userId, token);

	const youTubeVideoFromWatched = (watchedVideosIds: StatsHasuraDataArray) => {
		const promises = watchedVideosIds.map(async (v) => {
			const res = await getVideosBiId(v.videoId);
			return {
				...res,
			};
		});
		return Promise.all(promises);
	};
	const watchedVideoFromYouTube = await youTubeVideoFromWatched(
		watchedVideosIds
	);

	return {
		props: { watchedVideoFromYouTube },
	};
}

type MyListPageProps = {
	watchedVideoFromYouTube: VideoTypes[];
};

const MyList: NextPage<MyListPageProps> = ({ watchedVideoFromYouTube }) => {
	return (
		<div className={''}>
			<Head>
				<title>My List of videos</title>
				<meta name='my list video ' content='List of video userLike' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={styles.main}>
				<NavBar />
				<div className={styles.sectionWrapper}>
					<SectionCards
						title='My List'
						videos={watchedVideoFromYouTube}
						size='small'
						shouldWrap
						shouldScale={true}
					/>
				</div>
			</main>
		</div>
	);
};

export default MyList;
