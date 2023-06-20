import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Roboto_Slab } from 'next/font/google';
import { useEffect, useState } from 'react';
import { magic } from '../lib/magic';
import { useRouter } from 'next/router';
import Loading from '../components/loading/loading';

const roboto_slab = Roboto_Slab({
	subsets: ['latin'],
	weight: ['400', '600', '700', '800'],
	display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const isLoginCheck = async () => {
			setIsLoading(true);
			const isLogin = await magic?.user.isLoggedIn();
			if (isLogin) {
				setIsLoading(false);
				router.push('/');
			} else {
				setIsLoading(false);
				router.push('/login');
			}
		};
		// isLoginCheck();
	}, []);
	return (
		<main className={roboto_slab.className}>
			{isLoading ? <Loading /> : <Component {...pageProps} />}
		</main>
	);
}

export default MyApp;
