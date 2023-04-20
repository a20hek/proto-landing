import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Checkin } from '@/interfaces/Checkin';

interface CheckinsProp {
	checkins: Checkin[];
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_MAPBOX_ACCESS_TOKEN!;

export default function Map({ checkins }: CheckinsProp) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const [lng, setLng] = useState(77.5946);
	const [lat, setLat] = useState(12.9716);
	const [zoom, setZoom] = useState(9);

	function addCheckinMarkers() {
		if (!map.current) return;
		checkins.forEach((checkin) => {
			const marker = new mapboxgl.Marker()
				.setLngLat([checkin.longitude, checkin.latitude])
				.addTo(map.current!);
		});
	}

	useEffect(() => {
		if (map.current) return;
		if (!mapContainer.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom,
			minZoom: 1,
		});

		const geolocate = new mapboxgl.GeolocateControl({
			positionOptions: {
				enableHighAccuracy: true,
			},
			trackUserLocation: true,
		});
		map.current.addControl(geolocate);
		map.current.on('load', () => {
			geolocate.trigger();
		});
	});

	useEffect(() => {
		if (!map.current) return;
		map.current.on('move', () => {
			if (map.current) {
				setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
				setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
				setZoom(parseFloat(map.current.getZoom().toFixed(2)));
			}
		});
	});

	useEffect(() => {
		addCheckinMarkers();
	}, [checkins]);

	return (
		<div className='w-full h-full'>
			<div className='mapContain' style={{ width: '100%', height: '100%' }}>
				<div ref={mapContainer} className='map-container' />
			</div>
		</div>
	);
}
