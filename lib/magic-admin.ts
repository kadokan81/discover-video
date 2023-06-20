import { Magic } from '@magic-sdk/admin';

export const magicAdmin = new Magic(process.env.SERVER_SECRET_MAGIC_KEY); // ✨
