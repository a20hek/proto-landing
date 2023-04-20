import type { NextApiRequest, NextApiResponse } from 'next';
import mongoPromise from '@/lib/mongodb';

interface Checkin {
	_id: string;
	user_wallet_address: string;
	h3index: string;
	latitude: number;
	longitude: number;
	createdAt: Date;
	message: string;
}

const getCheckins = async (req: NextApiRequest, res: NextApiResponse<Checkin[]>) => {
	const client = await mongoPromise;
	const db = client.db('proto');
	const checkins = db.collection('checkins');
	const checkinDocs = await checkins.find({}).toArray();

	const checkinsData = checkinDocs.map((doc) => ({
		_id: doc._id.toString(),
		user_wallet_address: doc.user_wallet_address,
		h3index: doc.h3index,
		latitude: doc.latitude,
		longitude: doc.longitude,
		createdAt: doc.createdAt,
		message: doc.message,
	}));

	res.status(200).json(checkinsData);
};

export default getCheckins;
