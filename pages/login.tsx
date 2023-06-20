import React, { useEffect, useState } from 'react';
import styles from '../styles/Login.module.css';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { magic } from '../lib/magic';

const Login = () => {
	const [email, setEmail] = useState('');
	const [userMsg, setUserMsg] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();
	useEffect(() => {
		const handleComplete = () => {
			setIsLoading(false);
		};
		router.events.on('routeChangeComplete', handleComplete);
		router.events.on('routeChangeError', handleComplete);

		return () => {
			router.events.off('routeChangeComplete', handleComplete);
			router.events.off('routeChangeError', handleComplete);
		};
	}, [router]);

	const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUserMsg('');
		setEmail(e.target.value);
	};
	const handleLoginWithEmail = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();

		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			try {
				setIsLoading(true);
				const didToken = await magic?.auth.loginWithMagicLink({ email });

				if (didToken) {
					const response = await fetch('/api/login', {
						method: 'POST',
						headers: {
							Authorization: `Bearer ${didToken}`,
							'Content-type': 'application/json',
						},
					});

					const loginInResponse = await response.json();

					if (loginInResponse.done) {
						setIsLoading(false);
						router.push('/');
					}
					setIsLoading(false);
					router.push('/');
				} else {
					setIsLoading(false);
					setUserMsg('Something went wrong logging in ');
				}
			} catch (error) {
				console.log(error);
				setIsLoading(false);
			}
		} else {
			// show user message
			setIsLoading(false);
			setUserMsg('Enter a valid email address');
		}
	};
	return (
		<div className={styles.container}>
			<Head>
				<title>Netflix SignIn</title>
			</Head>

			<header className={styles.header}>
				<div className={styles.headerWrapper}>
					<Link className={styles.logoLink} href='/'>
						<div className={styles.logoWrapper}>
							<Image
								src='/static/netflix.svg'
								alt='Netflix logo'
								width={128}
								height={34}
							/>
						</div>
					</Link>
				</div>
			</header>

			<main className={styles.main}>
				<div className={styles.mainWrapper}>
					<h1 className={styles.signinHeader}>Sign In</h1>

					<input
						type='text'
						placeholder='Email address'
						className={styles.emailInput}
						onChange={handleOnChangeEmail}
						autoComplete='on'
					/>

					<p className={styles.userMsg}>{userMsg}</p>
					<button onClick={handleLoginWithEmail} className={styles.loginBtn}>
						{isLoading ? 'Loading...' : 'Sign In'}
					</button>
				</div>
			</main>
		</div>
	);
};

export default Login;
