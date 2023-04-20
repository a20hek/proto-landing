import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Checkin } from '@/interfaces/Checkin';
import { useAtom } from 'jotai';
import { selectedCheckinAtom } from '@/context/selectedCheckin';
import { stageAtom } from '@/context/stage';

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
	const [, setSelectedCheckin] = useAtom(selectedCheckinAtom);
	const [stage] = useAtom(stageAtom);

	function addCheckinMarkers() {
		// Only add markers when stage is 2
		if (stage !== 2) return;
		if (!map.current) return;
		checkins.forEach((checkin) => {
			const marker = new mapboxgl.Marker()
				.setLngLat([checkin.longitude, checkin.latitude])
				.addTo(map.current!);

			marker.getElement().addEventListener('click', (event) => {
				event.stopPropagation(); // Stop the event from propagating to the map
				setSelectedCheckin(checkin);
				map.current!.flyTo({
					center: [checkin.longitude, checkin.latitude],
					essential: true,
					zoom: 14,
				});
			});
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

		// Add a click event listener to the map
		map.current.on('click', () => {
			setSelectedCheckin(null);
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
		if (!map.current) return;
		if (stage === 1) {
			map.current.flyTo({
				center: [lng, lat],
				zoom: 9,
				essential: true,
			});
		} else if (stage === 2) {
			map.current.flyTo({
				center: [78.9629, 20.5937], // India's approximate geographical center
				zoom: 4,
				essential: true,
				duration: 3000,
			});
			addCheckinMarkers();
		}
	}, [stage]);

	return (
		<div className='w-full h-full'>
			<div className='mapContain' style={{ width: '100%', height: '100%' }}>
				<div ref={mapContainer} className='map-container' />
			</div>
		</div>
	);
}
