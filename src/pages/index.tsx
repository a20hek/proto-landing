import Map from '@/components/Map';
import WalletConnectBtn from '@/components/WalletConnectBtn';
import { Logo } from '@/svgs/Logo';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { Checkin } from '@/interfaces/Checkin';
import { useAtom } from 'jotai';
import { selectedCheckinAtom } from '@/context/selectedCheckin';
import { initializeContract } from '@/utils/contractCall';
import { parseReverseGeo } from '@/utils/parseReverseGeo';
import { convertDate, getCurrentTimestamp } from '@/utils/timeUtils';
import { updatePlanNFT } from '@/utils/nftDB';
import axios from 'axios';
import { stageAtom } from '@/context/stage';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_MAPBOX_ACCESS_TOKEN!;

export default function Checkin() {
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);
	const [placeName, setPlaceName] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [selectedCheckin] = useAtom(selectedCheckinAtom);
	const wallet = useWallet();
	const [stage, setStage] = useAtom(stageAtom);

	async function handleClick() {
		try {
			// setIsLoading(true);
			// let pdl;
			// if (longitude > 0) {
			// 	pdl = 'DebYXwR1ZfhhAdnovnnzZEv8aJSQKg5Gb7HnKrK8spYx';
			// }
			// if (longitude < 0) {
			// 	pdl = '84UE82tmRPyMxJU9taGhBeeTJfv3YJLu5rBiPysyKteG';
			// }
			// const checkInPayload = {
			// 	user_wallet_address: wallet.publicKey?.toBase58() || '',
			// 	message: 'Minted the ProtoNFT!',
			// 	latitude: latitude,
			// 	longitude: longitude,
			// 	pdl: pdl,
			// 	caller: '5C1k9yV7y4CjMnKv8eGYDgWND8P89Pdfj79Trk2qmfGo',
			// 	choice: 1,
			// };

			// const checkInData = JSON.stringify(checkInPayload);

			// const config = {
			// 	method: 'post',
			// 	maxBodyLength: Infinity,
			// 	url: 'https://tef0kt92x3.execute-api.us-east-1.amazonaws.com/dev/v1/checkin',
			// 	headers: {
			// 		accept: 'application/json',
			// 		'Content-Type': 'application/json',
			// 	},
			// 	data: checkInData,
			// };

			// const response = await axios.request(config);

			// if (response.data.checkinData === true) {
			// 	if (!wallet || !wallet.publicKey) {
			// 		throw new Error('Wallet or wallet.publicKey is null');
			// 	}
			// 	const { sig, nft_mint } = await initializeContract(wallet.publicKey);
			// 	console.log('Transaction Signature:', sig);
			// 	const timestamp = getCurrentTimestamp();
			// 	const payload = {
			// 		claimaddress: wallet.publicKey?.toBase58() || '',
			// 		timestamp: timestamp,
			// 		latlong: `${latitude}, ${longitude}`,
			// 		place: placeName,
			// 		address: nft_mint.toBase58(),
			// 	};

			// 	await updatePlanNFT(payload);
			// 	setIsLoading(false);
			setStage(2);
			// }
		} catch (error) {
			setIsLoading(false);
			console.error(error);
		}
	}

	const handleSuccess = useCallback((position: GeolocationPosition) => {
		setLatitude(Math.round((position.coords.latitude + Number.EPSILON) * 10000) / 10000);
		setLongitude(Math.round((position.coords.longitude + Number.EPSILON) * 10000) / 10000);
	}, []);

	const handleError = useCallback((error: GeolocationPositionError) => {
		console.warn(`ERROR(${error.code}): ${error.message}`);
	}, []);

	useEffect(() => {
		const geoOptions = {
			enableHighAccuracy: false,
			timeout: 5000,
			maximumAge: Infinity,
		};
		navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
	}, [handleSuccess, handleError]);

	useEffect(() => {
		const getPlaceName = async (lat: number, lon: number) => {
			try {
				const response = await fetch(
					`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${mapboxgl.accessToken}`
				);
				const data = await response.json();

				if (data && data.features && data.features.length > 0) {
					const placeName = parseReverseGeo(data.features[0]);
					setPlaceName(placeName);
					console.log(placeName);
				} else {
					return 'Unknown Place';
				}
			} catch (error) {
				console.error('Error fetching place name:', error);
				return 'Unknown Place';
			}
		};
		getPlaceName(latitude, longitude).then((placeName) => {
			console.log(placeName);
		});
	}, [latitude, longitude]);

	const [checkins, setCheckins] = useState<Checkin[]>([]);

	useEffect(() => {
		const fetchCheckins = async () => {
			const res = await fetch('/api/checkins');
			const data = await res.json();
			setCheckins(data);
		};

		fetchCheckins();
		console.log(checkins);
	}, []);

	return (
		<>
			<div className='flex h-screen w-screen px-4 py-8 max-w-[1400px] mx-auto'>
				<div className='flex-col flex w-1/4 mr-6'>
					<Logo />
					<div className='h-full bg-slate-600 my-6 rounded-3xl'>
						<div className='py-12 px-4'>
							{
								selectedCheckin ? (
									<>
										<h1 className='text-white text-xl font-light'>About this Check-In</h1>
										<p className='text-white mt-8'>MESSAGE:</p>
										<p className='text-white text-2xl'>{selectedCheckin.message}</p>
										<p className='text-white mt-4'>FROM:</p>
										<p className='text-white text-xl font-light'>
											{selectedCheckin.latitude}, {selectedCheckin.longitude}
										</p>
										<p className='text-white mt-4'>AT:</p>
										<p className='text-white text-xl font-light'>
											{convertDate(selectedCheckin.createdAt)}
										</p>
										<p className='text-white mt-4'>WALLET ADDRESS:</p>
										<p className='text-white text-xs font-light w-6'>
											{selectedCheckin.user_wallet_address}
										</p>
									</>
								) : null
								// <>
								// 	<p className='text-white font-light text-xl'>
								// 		Welcome to our demo app, where you can mint an NFT that is tied to your location
								// 		- a &quot;Proof of Presence Claim&quot;. This demo app uses the proto API to
								// 		bring you this experience. We&apos;ve geofenced this minting process. Only users
								// 		in the US and India can mint it. After minting your NFT, you&apos;ll be directed
								// 		to a page where you can view all the Proof of Presence claims that have been
								// 		minted on a map. You&apos;ll also see some of our internal check-ins done by our
								// 		team, so you can get a feel for how the app works.
								// 	</p>
								// 	<p className='text-white mt-6 font-light'>NOTE:</p>

								// 	<p className='text-gray-200 font-extralight'>
								// 		1. These are only &quot;Claims for Proof of Location&quot;; and not verified
								// 		Check-In&apos;s. Verified Check-In&apos;s for Mobile Devices will be live in Q3.
								// 	</p>
								// 	<p className='text-gray-200 font-extralight'>
								// 		2. Your location data will only be used for minting the &quot;Proof of
								// 		Presence&quot; NFT and populating the map in this demo.
								// 	</p>
								// </>
							}
						</div>
					</div>
					{stage === 1 &&
						(!wallet.connected ? (
							<WalletConnectBtn />
						) : (
							<button
								className={`bg-[#14aede] hover:bg-[#0f95c2] active:bg-[#0b7a99] py-4 rounded-xl text-white text-xl font-semibold transition-all duration-200 transform active:scale-105 
      disabled:cursor-not-allowed`}
								onClick={handleClick}
								disabled={isLoading}>
								{isLoading ? <span>Loading...</span> : <span>Mint</span>}
							</button>
						))}
				</div>
				<div className='h-full my-auto rounded-3xl flex-grow overflow-hidden'>
					<Map checkins={checkins} />
				</div>
			</div>
		</>
	);
}
