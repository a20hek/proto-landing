import { AnchorProvider, Idl, Program, Wallet, web3 } from '@project-serum/anchor';
import { clusterApiUrl, ConfirmOptions, Connection, PublicKey } from '@solana/web3.js';
import * as spl from '@solana/spl-token';
import rawIdl from '../../idl.json';

const network = clusterApiUrl('devnet');

const opts: ConfirmOptions = {
	preflightCommitment: 'processed',
};

const idl: Idl = rawIdl as Idl;

export const getProvider = () => {
	const connection = new Connection(network, 'confirmed');
	const provider = new AnchorProvider(connection, window.solana, opts);
	return provider;
};

export const getProgram = async () => {
	const provider = getProvider();
	const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
	return new Program(idl, programId, provider);
};

export const initializeContract = async (publicKey: PublicKey) => {
	try {
		if (!publicKey) {
			throw new Error('publicKey is null');
		}

		const program = await getProgram();
		const provider = getProvider();
		const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
			'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
		);

		let [nft_data, vPDA1] = await PublicKey.findProgramAddress(
			[Buffer.from('nft-data'), publicKey.toBuffer()],
			program.programId
		);

		let [nft_mint, vPDA2] = await PublicKey.findProgramAddress(
			[Buffer.from('nft-mint'), publicKey.toBuffer()],
			program.programId
		);

		let nft_ata = await spl.getAssociatedTokenAddress(
			nft_mint,
			provider.wallet.publicKey,
			false,
			spl.TOKEN_PROGRAM_ID,
			spl.ASSOCIATED_TOKEN_PROGRAM_ID
		);

		let [masterKey] = await PublicKey.findProgramAddress(
			[
				Buffer.from('metadata'),
				TOKEN_METADATA_PROGRAM_ID.toBuffer(),
				nft_mint.toBuffer(),
				Buffer.from('edition'),
			],
			TOKEN_METADATA_PROGRAM_ID
		);

		let metadataKey = (
			await PublicKey.findProgramAddress(
				[Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), nft_mint.toBuffer()],
				TOKEN_METADATA_PROGRAM_ID
			)
		)[0];

		let nft_metadata = metadataKey;
		let nft_master_edition = masterKey;

		const sig = await program.methods
			.nftMint()
			.accounts({
				authority: publicKey,
				nftMint: nft_mint,
				dataAccount: nft_data,
				receiverAta: nft_ata,
				nftMetadata: nft_metadata,
				nftMasterEdition: nft_master_edition,
				mplProgram: TOKEN_METADATA_PROGRAM_ID,
				associatedTokenProgram: spl.ASSOCIATED_TOKEN_PROGRAM_ID,
			})
			.rpc({
				skipPreflight: true,
			});

		console.log('Transaction Signature:', sig);
		return sig;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
