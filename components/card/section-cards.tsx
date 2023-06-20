import Card from './card';
import Link from 'next/link';
import clsx from 'classnames';
import styles from './section-cards.module.css';
import { FC } from 'react';

export type VideoTypes = {
	id: string;
	imgUrl: string;
	title: string;
};

export type SectionCardsTypes = {
	title: string;
	videos: VideoTypes[];
	size: 'large' | 'small' | 'medium';
	shouldWrap: boolean;
	shouldScale: boolean;
};

const SectionCards: FC<SectionCardsTypes> = ({
	title,
	videos = [],
	size,
	shouldWrap = false,
	shouldScale,
}) => {
	return (
		<section className={styles.container}>
			<h2 className={styles.title}>{title}</h2>
			<div className={clsx(styles.cardWrapper, shouldWrap && styles.wrap)}>
				{videos.map((video, ind) => {
					return (
						<Link href={`/video/${video.id}`} key={video.id + ind}>
							<Card
								id={video.id.toString()}
								imgUrl={video.imgUrl}
								size={size}
								shouldScale={shouldScale}
							/>
						</Link>
					);
				})}
			</div>
		</section>
	);
};

export default SectionCards;
