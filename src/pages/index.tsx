import Map from '@/components/Map';
import { Logo } from '@/svgs/Logo';
import { useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState, useRef, RefObject } from 'react';

export default function Checkin() {
	const { connected } = useWallet();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<>
			<div className='flex h-screen w-screen px-4 py-8 max-w-[1400px] mx-auto'>
				<div className='flex-col flex w-1/4 mr-6'>
					<Logo />
					<div className='h-full bg-slate-600 my-6 rounded-3xl'></div>
					<button className='bg-[#14aede] py-4 rounded-xl text-white text-xl font-semibold transition-all duration-300 ease-in-out hover:bg-[#0f95c2]'>
						Mint
					</button>
				</div>
				<div className='h-full my-auto rounded-3xl flex-grow overflow-hidden'>
					<Map />
				</div>
			</div>
		</>
	);
}
