import axios from 'axios';

const updatePlanNFTUrl = 'https://pdne8k7lki.execute-api.us-east-2.amazonaws.com/dev/updatePlanNFT';

interface UpdatePlanNFTPayload {
	claimaddress: string;
	timestamp: string;
	latlong: string;
	place: string;
	address: string;
}

async function updatePlanNFT(payload: UpdatePlanNFTPayload): Promise<void> {
	const data = JSON.stringify(payload);

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: updatePlanNFTUrl,
		headers: {
			'X-API-Key': 'psaUQHvfxL6YTRzl5SU6h6qbdYseaJPn3iJAkwYV',
			'Content-Type': 'application/json',
		},
		data: data,
	};

	try {
		const response = await axios.request(config);
		console.log(JSON.stringify(response.data));
	} catch (error) {
		console.error('Error during minting:', error);
	}
}

export { updatePlanNFT };
