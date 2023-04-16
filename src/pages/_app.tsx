import Wallets from '@/components/Wallets';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Wallets>
			<Component {...pageProps} />
		</Wallets>
	);
}
