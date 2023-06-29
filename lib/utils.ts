import jwt from 'jsonwebtoken';
import { DecodedTokenTypes } from '../types/you';
export const verifyToken = (token: string) => {
	const secret = process.env.JWT_SECRET || '';
	const decoded = jwt.verify(token, secret) as DecodedTokenTypes;

	return decoded.issuer;
};
