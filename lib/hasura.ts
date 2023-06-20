/*
This is an example snippet - you should consider tailoring it
to your service.
*/

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
