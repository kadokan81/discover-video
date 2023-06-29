/*
This is an example snippet - you should consider tailoring it
to your service.
*/

type StatsHasuraData = {
	favourited: Number;
	watched: Boolean;
	videoId: String;
	userId: String;
	id: Number;
};

export type StatsHasuraDataArray = StatsHasuraData[];

async function queryHasuraGQL(
	operationsDoc: string,
	operationName: string,
	variables: Record<string, any>,
	token: string
) {
	const url = process.env.NEXT_PUBLIC_HASURA_ADMIN_URL
		? process.env.NEXT_PUBLIC_HASURA_ADMIN_URL.toString()
		: '';

	return await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			// 'x-hasura-admin-secret': hasuraKey,
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			query: operationsDoc,
			variables,
			operationName,
		}),
	}).then((result) => result.json());
}

export async function startExecuteMyMutation() {
	// const { errors, data } = await executeMyMutation();
	// if (errors) {
	// 	// handle those errors like a pro
	// 	console.error(errors);
	// }
	// // do something great with this precious data
	// console.log(data);
}

export async function isNewUser(token: string, issuer: string) {
	const operationsDoc = `
	query isNewUser($issuer: String!) {
	  users(where: {issuer: {_eq: $issuer}}) {
		id
		email
		issuer
	  }
	}

	mutation MyMutation {
		insert_users(objects: {email: "nateEgot@gmail.com", id: 10, issuer: "242332b22D7fdF68", publicAddress: "242332b22D7fdF68"}) {
		  affected_rows
		  returning {
			email
			issuer
			publicAddress
		  }
		}
	  }
  `;

	const response = await queryHasuraGQL(
		operationsDoc,
		'isNewUser',
		{
			issuer,
		},
		token
	);

	return response?.data?.users?.length === 0;
}

export async function createNewUser(token: string, metadata: any) {
	const operationsDoc = `
	mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
	  insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
		returning {
		  email
		  id
		  issuer
		}
	  }
	}
  `;

	const { issuer, email, publicAddress } = metadata;
	const response = await queryHasuraGQL(
		operationsDoc,
		'createNewUser',
		{
			issuer,
			email,
			publicAddress,
		},
		token
	);

	return response;
}

export const findVideoIdByUser = async (
	token: string,
	userId: string,
	videoId: string
) => {
	const operationsDoc = `
	query fineVideoIdByUserId($userId: String!,$videoId: String!) {
	  stats(where: {userId: {_eq:$userId }, videoId: {_eq: $videoId}}) {
		favourited
		id
		userId
		videoId
		watched
	  }
	}
  `;

	const response = await queryHasuraGQL(
		operationsDoc,
		'fineVideoIdByUserId',
		{
			userId,
			videoId,
		},
		token
	);

	return response?.data?.stats as [
		{
			favourited: number;
			id: string;
			userId: string;
			videoId: string;
			watched: boolean;
		}
	];
};

export type InsertStatsTypes = {
	favourited: number;
	userId: String;
	watched: Boolean;
	videoId: String;
};

export async function insertStats(
	token: string,
	{ ...props }: InsertStatsTypes
) {
	const operationsDoc = `
	mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
	  insert_stats_one(object: {
		favourited: $favourited, 
		userId: $userId, 
		watched: $watched, 
		videoId: $videoId
	  }) {
		  favourited
		  userId
	  }
	}
  `;

	return await queryHasuraGQL(
		operationsDoc,
		'insertStats',
		{ ...props },
		token
	);
}

export async function updateStats(
	token: string,
	{ favourited, userId, watched, videoId }: InsertStatsTypes
) {
	const operationsDoc = `
  mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId: String!) {
	update_stats(
	  _set: {watched: $watched, favourited: $favourited}, 
	  where: {
		userId: {_eq: $userId}, 
		videoId: {_eq: $videoId}
	  }) {
	  returning {
		favourited,
		userId,
		watched,
		videoId
	  }
	}
  }
  `;

	return await queryHasuraGQL(
		operationsDoc,
		'updateStats',
		{ favourited, userId, watched, videoId },
		token
	);
}

export async function getMyListVideos(userId: string, token: string) {
	const operationsDoc = `
	query favouritedVideos($userId: String!) {
	  stats(where: {
		userId: {_eq: $userId}, 
		favourited: {_eq: 1}
	  }) {
		videoId
	  }
	}
  `;

	const response = await queryHasuraGQL(
		operationsDoc,
		'favouritedVideos',
		{
			userId,
		},
		token
	);

	return response?.data?.stats as StatsHasuraDataArray;
}

export async function getWatchedVideos(userId: string, token: string) {
	const operationsDoc = `
	query watchedVideos($userId: String!) {
	  stats(where: {
		watched: {_eq: true}, 
		userId: {_eq: $userId},
	  }) {
		videoId
	  }
	}
  `;

	const response = await queryHasuraGQL(
		operationsDoc,
		'watchedVideos',
		{
			userId,
		},
		token
	);

	return response?.data?.stats as StatsHasuraDataArray;
}
