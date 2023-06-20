import { Magic } from 'magic-sdk';
const createMagic = () => {
	if (typeof window !== 'undefined') {
		return new Magic('pk_live_A2C219A90721A9CB', {
			network: 'mainnet',
		});
	}
};

export const magic = createMagic();
