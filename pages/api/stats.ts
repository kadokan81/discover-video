import { InsertStatsTypes, insertStats } from './../../lib/hasura';
import { DecodedTokenTypes } from './../../types/you';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { findVideoIdByUser, updateStats } from '../../lib/hasura';
import { verifyToken } from '../../lib/utils';

type Data = {};

interface MyNextApiRequest extends NextApiRequest {
	cookies: {
		token: string | undefined;
	};
	query: {
		videoId: string;
	};
	// body: {
	// 	videoId: string;
	// 	favourited: Number;
	// 	watched: boolean;
	// };
}

export default async function stats(
	req: MyNextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		try {
			const token = req.cookies.token;
			if (!token) {
				res.status(403).send({
					msg: 'no cookies',
				});
			} else {
				const issuer = (await verifyToken(token)) as string;

				const body = req.body;

				const statsData = await findVideoIdByUser(token, issuer, body.videoId);

				const doesStatsExist = statsData?.length > 0;
				if (!doesStatsExist) {
					//add video to data base

					const props: InsertStatsTypes = {
						favourited: 0,
						userId: issuer,
						videoId: body.videoId,
						watched: true,
					};
					const response = await insertStats(token, { ...props });
					return res.send({ msg: 'Add new stays row', response });
				} else {
					// update it

					const { favourited, videoId, watched = true } = body;
					const props: InsertStatsTypes = {
						favourited: +favourited,
						userId: issuer,
						videoId: videoId,
						watched: watched,
					};
					const response = await updateStats(token, { ...props });

					return res.send({ msg: 'Update stays row', response });
				}

				return res.send({ issuer, doesStatsExist });
			}
		} catch (error) {
			console.error('Error occurred / stats', error);
		}
	} else {
		//// 		req.method === 'GET'

		try {
			const token = req.cookies.token;
			if (!token) {
				return res.status(403).send({
					msg: 'no cookies',
				});
			} else {
				const secret = process.env.JWT_SECRET || '';

				const decoded = jwt.verify(token, secret) as DecodedTokenTypes;

				const { videoId } = req.query;

				const statsDataArray = await findVideoIdByUser(
					token,
					decoded.issuer,
					videoId
				);
				const doesStatsExist = statsDataArray?.length > 0;

				if (doesStatsExist) {
					//add video to data base

					return res.send({ msg: 'video data', statsDataArray });
				} else {
					// update it
					res.status(404);

					return res.send({ msg: 'no video like this', statsDataArray });
				}
			}
		} catch (error) {
			console.error('Error occurred / stats', error);
		}
	}
}
