// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { magicAdmin } from '../../lib/magic-admin';
import jwt from 'jsonwebtoken';
import { createNewUser, isNewUser } from '../../lib/hasura';
import { setTokenCookies } from '../../lib/cookies';
import { MagicUserMetadata } from 'magic-sdk';

type Data = {
	done: boolean;
	error?: string;
};

export default async function login(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (req.method === 'POST') {
		try {
			const auth = req.headers.authorization;
			const authToken = auth ? auth.substring(7) : '';

			const userMetaDate: MagicUserMetadata = await magicAdmin.users.getMetadataByToken(
				authToken
			);
			console.log('🚀 ~ file: login.ts:26 ~ userMetaDate:', userMetaDate);

			const token = jwt.sign(
				{
					...userMetaDate,
					iat: Math.floor(Date.now() / 1000),
					exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
					'https://hasura.io/jwt/claims': {
						'x-hasura-default-role': 'user',
						'x-hasura-allowed-roles': ['user', 'admin'],
						'x-hasura-user-id': `${userMetaDate.issuer}`,
					},
				},
				//@ts-ignore
				process.env.JWT_SECRET
			);

			//check if user exists
			//@ts-ignore
			const isNewUserQuery = await isNewUser(token, userMetaDate.issuer);
			console.log('🚀 ~ file: login.ts:46 ~ isNewUserQuery:', isNewUserQuery);

			isNewUserQuery && (await createNewUser(token, userMetaDate));

			setTokenCookies(token, res);
			res.status(200).json({ done: true });
		} catch (error) {
			res.status(500).json({ error: 'new error', done: false });
		}
	} else {
		res.send({ done: false });
	}
}
