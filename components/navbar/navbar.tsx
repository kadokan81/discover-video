import { FC, useEffect, useState } from 'react';
import styles from './navbar.module.css';

import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { magic } from '../../lib/magic';
import { MagicUserMetadata } from 'magic-sdk';

// import { magic } from "../../lib/magic-client";

const NavBar: FC = () => {
	const [showDropdown, setShowDropdown] = useState(false);
	const [username, setUsername] = useState('User Email');
	const [didToken, setDidToken] = useState('');
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const data:
					| MagicUserMetadata
					| undefined = await magic?.user.getMetadata();

				const didToken = await magic?.user.getIdToken();

				if (data?.email) {
					setUsername(data.email);
				}
				if (didToken) {
					setDidToken(didToken);
				}
			} catch (err) {
				console.log(err);
				// Handle errors if required!
			}
		};

		fetchUser();
	}, []);

	// useEffect(() => {
	// 	const applyUsernameInNav = async () => {
	// 		try {
	// 			const { email, issuer } = await magic.user.getMetadata();
	// 			const didToken = await magic.user.getIdToken();
	// 			if (email) {
	// 				setUsername(email);
	// 				setDidToken(didToken);
	// 			}
	// 		} catch (error) {
	// 			console.error('Error retrieving email', error);
	// 		}
	// 	};
	// 	applyUsernameInNav();
	// }, []);

	const handleOnClickHome = (e: React.SyntheticEvent) => {
		e.preventDefault();
		router.push('/');
	};

	const handleOnClickMyList = (e: React.SyntheticEvent) => {
		e.preventDefault();
		router.push('/browse/my-list');
	};

	const handleShowDropdown = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setShowDropdown(!showDropdown);
	};

	const handleSignOut = async (e: React.SyntheticEvent) => {
		e.preventDefault();

		try {
			await magic?.user.logout();
			const isLogin = await magic?.user.isLoggedIn();

			// console.log(await magic?.user.isLoggedIn()); // => `false`
			if (!isLogin) {
				setUsername('User Email');
				router.push('/login');
			}
		} catch (error) {
			// Handle errors if required!
			console.error('Error logging out', error);
			router.push('/login');
		}
		// try {
		// 	const response = await fetch('/api/logout', {
		// 		method: 'POST',
		// 		headers: {
		// 			Authorization: `Bearer ${didToken}`,
		// 			'Content-Type': 'application/json',
		// 		},
		// 	});

		// 	const res = await response.json();
		// } catch (error) {
		// 	console.error('Error logging out', error);
		// 	router.push('/login');
		// }
	};

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
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

				<ul className={styles.navItems}>
					<li className={styles.navItem} onClick={handleOnClickHome}>
						<Link href={'/'}>Home</Link>
					</li>
					<li className={styles.navItem2} onClick={handleOnClickMyList}>
						<Link href={'/browse/my-list'}>My List</Link>
					</li>
				</ul>
				<nav className={styles.navContainer}>
					<div>
						<button className={styles.usernameBtn} onClick={handleShowDropdown}>
							<p className={styles.username}>{username}</p>
							{/** Expand more icon */}
							<Image
								className={showDropdown ? styles.rotate : styles.norm}
								src={'/static/expand_more.svg'}
								alt='Expand dropdown'
								width={24}
								height={24}
							/>
						</button>

						{showDropdown && (
							<div className={styles.navDropdown}>
								<div>
									<a className={styles.linkName} onClick={handleSignOut}>
										{username === 'User Email' ? 'Sign In' : 'Sign out'}
									</a>
									<div className={styles.lineWrapper}></div>
								</div>
							</div>
						)}
					</div>
				</nav>
			</div>
		</div>
	);
};

export default NavBar;
