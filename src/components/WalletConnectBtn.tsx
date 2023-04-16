import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';
import { chakra } from '@chakra-ui/react';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useEffect, useState } from 'react';

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
	{ ssr: false }
);
const ConnectButton = chakra(WalletMultiButtonDynamic);

const WalletConnectBtn = () => {
	const { connected, wallet } = useWallet();
	return (
		<>
			{!connected ? (
				<ConnectButton
					bg='#14aede'
					padding={4}
					transition='0.2s ease-in-out'
					borderRadius='12px'
					fontSize='lg'
					_hover={{ bg: '#0f95c2' }}
					_active={{ bg: '#0b7a99' }}>
					<p className='w-full text-center'>Connect Wallet</p>
				</ConnectButton>
			) : null}
		</>
	);
};

export default WalletConnectBtn;
