import Map from '@/components/Map';
import WalletConnectBtn from '@/components/WalletConnectBtn';
import { Logo } from '@/svgs/Logo';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_MAPBOX_ACCESS_TOKEN!;

export default function Checkin() {
	const { connected, publicKey } = useWallet();
	const [latitude, setLatitude] = useState<number>(0);
	const [longitude, setLongitude] = useState<number>(0);
	const [placeName, setPlaceName] = useState<string>('');

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

	function parseReverseGeo(geoData: any) {
		var cityName, stateName, countryName, returnStr;
		if (geoData.context) {
			geoData.context.forEach((v: any) => {
				if (v.id.indexOf('place') >= 0) {
					cityName = v.text;
				}
				if (v.id.indexOf('region') >= 0) {
					stateName = v.text;
				}
				if (v.id.indexOf('country') >= 0) {
					countryName = v.text;
				}
			});
		}
		if (cityName && stateName && countryName) {
			returnStr = cityName + ', ' + stateName + ', ' + countryName;
		} else {
			returnStr = geoData.place_name;
		}
		if (returnStr.length > 32 && cityName && countryName) {
			returnStr = cityName + ', ' + countryName;
		}
		return returnStr;
	}

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

	const handleClick = async () => {
		const getCurrentTimestamp = () => {
			const now = new Date();
			const hours = String(now.getHours()).padStart(2, '0');
			const minutes = String(now.getMinutes()).padStart(2, '0');
			const seconds = String(now.getSeconds()).padStart(2, '0');
			const day = String(now.getDate()).padStart(2, '0');
			const month = String(now.getMonth() + 1).padStart(2, '0');
			const year = String(now.getFullYear()).slice(-2);

			return `${hours}:${minutes}:${seconds}, ${day}.${month}.${year}`;
		};
		const timestamp = getCurrentTimestamp();
		const payload = {
			claimaddress: publicKey?.toBase58() || '',
			timestamp: timestamp,
			latlong: { latitude, longitude },
			place: placeName,
			address: 'HELLOWORLD',
		};

		const requestOptions = {
			method: 'POST',
			headers: {
				'X-API-Key': 'psaUQHvfxL6YTRzl5SU6h6qbdYseaJPn3iJAkwYV',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		};

		try {
			const response = await fetch(
				'https://pdne8k7lki.execute-api.us-east-2.amazonaws.com/dev/updatePlanNFT',
				requestOptions
			);
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	};

	return (
		<>
			<div className='flex h-screen w-screen px-4 py-8 max-w-[1400px] mx-auto'>
				<div className='flex-col flex w-1/4 mr-6'>
					<Logo />
					<div className='h-full bg-slate-600 my-6 rounded-3xl'></div>
					{!connected ? (
						<WalletConnectBtn />
					) : (
						<button
							className='bg-[#14aede] hover:bg-[#0f95c2] active:bg-[#0b7a99] py-4 rounded-xl text-white text-xl font-semibold transition-all duration-200 transform active:scale-105'
							onClick={handleClick}>
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
