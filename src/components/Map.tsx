import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_MAPBOX_ACCESS_TOKEN!;

export default function Map() {
	const mapContainer = useRef<HTMLDivElement>(null);
	const map = useRef<mapboxgl.Map | null>(null);
	const [lng, setLng] = useState(77.5946);
	const [lat, setLat] = useState(12.9716);
	const [zoom, setZoom] = useState(9);

	useEffect(() => {
		if (map.current) return;
		if (!mapContainer.current) return;
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			projection: {
				name: 'mercator',
				center: [lng, lat],
				parallels: [30, 30],
			},
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
		if (!map.current) return; // wait for map to initialize
		map.current.on('move', () => {
			if (map.current) {
				setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
				setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
				setZoom(parseFloat(map.current.getZoom().toFixed(2)));
			}
		});
	});

	return (
		<div className='w-full h-full'>
			<div className='mapContain' style={{ width: '100%', height: '100%' }}>
				<div ref={mapContainer} className='map-container' />
			</div>
		</div>
	);
}
