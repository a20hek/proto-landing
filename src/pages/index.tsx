import Map from '@/components/Map';
import WalletConnectBtn from '@/components/WalletConnectBtn';
import { Logo } from '@/svgs/Logo';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState, useCallback } from 'react';

export default function Checkin() {
	const { connected, publicKey } = useWallet();
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);

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

	// to watch location
	// useEffect(() => {
	// 	const geoOptions = {
	// 		enableHighAccuracy: false,
	// 		timeout: 5000,
	// 		maximumAge: Infinity,
	// 	};

	// 	const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, geoOptions);

	// 	return () => {
	// 		navigator.geolocation.clearWatch(watchId);
	// 	};
	// }, [handleSuccess, handleError]);

	return (
		<>
			<div className='flex h-screen w-screen px-4 py-8 max-w-[1400px] mx-auto'>
				<div className='flex-col flex w-1/4 mr-6'>
					<Logo />
					<div className='h-full bg-slate-600 my-6 rounded-3xl'></div>
					{!connected ? (
						<WalletConnectBtn />
					) : (
						<button className='bg-[#14aede] hover:bg-[#0f95c2] active:bg-[#0b7a99] py-4 rounded-xl text-white text-xl font-semibold transition-all duration-200 transform active:scale-105'>
							Mint
						</button>
					)}
				</div>
				<div className='h-full my-auto rounded-3xl flex-grow overflow-hidden'>
					<Map />
				</div>
			</div>
		</>
	);
}
