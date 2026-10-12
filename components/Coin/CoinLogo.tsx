'use client';

import Image from 'next/image';
import {useState} from 'react';

const CoinLogo = ({symbol, size = 40}: {symbol: string; size?: number}) => {
	const [failed, setFailed] = useState(false);
	const letter = symbol.slice(0, 1).toUpperCase() || '?';

	if (failed) {
		return (
			<span
				className='flex shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700 dark:bg-zinc-700 dark:text-zinc-200'
				style={{width: size, height: size}}
			>
				{letter}
			</span>
		);
	}

	return (
		<Image
			src={`https://assets.coincap.io/assets/icons/${symbol.toLowerCase()}@2x.png`}
			alt=''
			width={size}
			height={size}
			unoptimized
			className='shrink-0 rounded-full bg-gray-100 object-cover dark:bg-zinc-700'
			style={{width: size, height: size}}
			onError={() => setFailed(true)}
		/>
	);
};

export default CoinLogo;
