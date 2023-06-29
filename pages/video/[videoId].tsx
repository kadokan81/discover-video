import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { FC, useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from '../../styles/Video.module.css';
import NavBar from '../../components/navbar/navbar';
import clsx from 'classnames';
import Like from '../../components/icons/like-icon';
import DisLike from '../../components/icons/dislike-icon';
import { GetStaticPropsContext } from 'next';
import { getVideosBiId } from '../../lib/videos';

Modal.setAppElement('#__next');

const customStyles = {
	overlay: {
		backgroundColor: '#2f2e2e',
	},
	content: {
		top: '48%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		width: '90%',
		height: '80%',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		backgroundColor: 'black',
		borderRadius: '20px',
		overflow: 'hidden',
	},
};

type ParamsWithId = {
	params: {
		videoId: string;
	};
};
type ContextTypeWithVideoId = GetStaticPropsContext & ParamsWithId;

export const getStaticProps = async (context: ContextTypeWithVideoId) => {
	const searchId = context.params.videoId
		? context.params?.videoId
		: '4zH5iYM4wJo';

	const video = await getVideosBiId(searchId);

	return {
		props: {
			video,
		},
		// Next.js will attempt to re-generate the page:
		// - When a request comes in
		// - At most once every 10 seconds
		revalidate: 10, // In seconds
	};
};

export async function getStaticPaths() {
	const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];

	const paths = listOfVideos.map((videoId) => ({
		params: { videoId },
	}));

	return { paths, fallback: 'blocking' };
}

export interface VideoPageQuery extends ParsedUrlQuery {
	videoId?: string;
}

export type VideoPageType = {
	video: {
		title: string;
		imgUrl: string;
		description: string;
		publishedAt: string;
		id: string;
		viewCount: string;
		channelTitle: string;
	};
};

export type ApiVideoResponseType = {
	favourited: Number;
	id: Number;
	userId: String;
	videoId: String;
	watched: boolean;
};

export type DataResponseType = {
	statsDataArray: Array<ApiVideoResponseType>;
};

const Video = ({ video }: VideoPageType) => {
	const router = useRouter();
	const { videoId } = router.query as VideoPageQuery;
	const [toggleLike, setToggleLike] = useState(false);
	const [toggleDisLike, setToggleDisLike] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(() => true);

	const srcString = `http://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0`;

	useEffect(() => {
		setIsModalOpen(true);
		const getLastVideoFData = async () => {
			const response = await fetch(`/api/stats?videoId=${videoId}`, {
				method: 'GET',
			});
			const data = (await response.json()) as DataResponseType;

			const { statsDataArray } = data;

			if (statsDataArray.length > 0) {
				const favourited = statsDataArray[0].favourited;
				if (favourited === 1) {
					setToggleLike(true);
				} else if (favourited === 0) {
					setToggleDisLike(true);
				}
			}
		};

		getLastVideoFData();
		return () => {
			setIsModalOpen(false);
		};
	}, []);

	const runRatingService = async (favourited: number) => {
		return await fetch('/api/stats', {
			method: 'POST',
			body: JSON.stringify({
				videoId,
				favourited,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	const handleToggleDislike = async () => {
		setToggleDisLike(!toggleDisLike);
		setToggleLike(toggleDisLike);
		const val = !toggleDisLike;
		const favourited = val ? 0 : 1;
		const response = await runRatingService(favourited);
	};

	const handleToggleLike = async () => {
		const val = !toggleLike;
		setToggleLike(val);
		setToggleDisLike(toggleLike);
		const favourited = val ? 1 : 0;

		const response = await runRatingService(favourited);
	};

	return (
		<div className={styles.container}>
			<NavBar />

			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => router.push('/')}
				contentLabel='video Modal'
				style={customStyles}
				className={styles.modal}
			>
				<iframe
					className={styles.videoPlayer}
					id='player'
					typeof='text/html'
					width='100%'
					height='60%'
					src={srcString}
				></iframe>

				<div className={styles.likeDislikeBtnWrapper}>
					<div className={styles.likeBtnWrapper}>
						<button onClick={handleToggleLike}>
							<div className={styles.btnWrapper}>
								<Like selected={toggleLike} />
							</div>
						</button>
					</div>
					<button onClick={handleToggleDislike}>
						<div className={styles.btnWrapper}>
							<DisLike selected={toggleDisLike} />
						</div>
					</button>
				</div>
				<div className={styles.modalBody}>
					<div className={styles.modalBodyContent}>
						<div className={styles.col1}>
							<p className={styles.publishTime}>{video.publishedAt}</p>
							<p className={styles.title}>{video.title}</p>
							<p className={styles.description}>{video.description}</p>
						</div>
						<div className={styles.col2}>
							<p className={clsx(styles.subText, styles.subTextWrapper)}>
								<span className={styles.textColor}>Cast: </span>
								<span className={styles.channelTitle}>
									{video.channelTitle}
								</span>
							</p>
							<p className={clsx(styles.subText, styles.subTextWrapper)}>
								<span className={styles.textColor}>View Count: </span>
								<span className={styles.channelTitle}>{video.viewCount}</span>
							</p>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default Video;
