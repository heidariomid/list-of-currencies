export type ChartPoint = {
	t: number;
	price: number;
	volume: number;
};

export type CoinChart = {
	points: ChartPoint[];
};

export type CoinLink = {
	label: string;
	href: string;
};

export type CoinDetail = {
	id: string;
	symbol: string;
	name: string;
	image: string;
	rank: number | null;
	description: string;
	categories: string[];
	links: CoinLink[];
	price: number;
	change24h: number | null;
	change24hValue: number | null;
	change7d: number | null;
	change30d: number | null;
	change1y: number | null;
	marketCap: number | null;
	marketCapChange24h: number | null;
	volume: number | null;
	fdv: number | null;
	high24h: number | null;
	low24h: number | null;
	circulatingSupply: number | null;
	totalSupply: number | null;
	maxSupply: number | null;
	ath: number | null;
	athChange: number | null;
	athDate: string | null;
	atl: number | null;
	atlChange: number | null;
	atlDate: string | null;
	lastUpdated: string | null;
};
