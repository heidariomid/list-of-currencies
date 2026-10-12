import {SortDir, SortKey} from '../../utils/listParams';

type THeadCurrenciesProps = {
	sort: SortKey;
	dir: SortDir;
	onSort: (sort: SortKey) => void;
};

type Column = {
	label: string;
	className: string;
	sortKey?: SortKey;
};

const columns: Column[] = [
	{label: 'RANK', className: 'px-4 py-3 text-left text-xs font-medium  uppercase tracking-wider'},
	{label: 'COINS', className: 'px-12 py-3 text-left text-xs font-medium  uppercase tracking-wider'},
	{label: 'PRICE', className: 'px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider', sortKey: 'current_price'},
	{label: '24H', className: 'px-10 py-3 text-left text-xs font-medium  uppercase tracking-wider', sortKey: 'price_change_percentage_24h'},
	{label: 'VOLUME', className: 'px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider', sortKey: 'total_volume'},
	{label: 'HIGH', className: 'px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'},
	{label: 'LOW', className: 'px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider'},
];

const THeadCurrencies = ({sort, dir, onSort}: THeadCurrenciesProps) => {
	return (
		<thead className='bg-black text-white dark:text-zinc-400 dark:bg-ocean'>
			<tr>
				{columns.map((column) => {
					const active = column.sortKey !== undefined && column.sortKey === sort;
					const ariaSort = !column.sortKey ? undefined : active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none';
					return (
						<th key={column.label} scope='col' aria-sort={ariaSort} className={column.className}>
							{column.sortKey ? (
								<button type='button' onClick={() => onSort(column.sortKey as SortKey)} className='inline-flex items-center gap-1 uppercase tracking-wider cursor-pointer'>
									{column.label}
									{active && (
										<span aria-hidden='true' className='text-green-400'>
											{dir === 'asc' ? '↑' : '↓'}
										</span>
									)}
								</button>
							) : (
								column.label
							)}
						</th>
					);
				})}
			</tr>
		</thead>
	);
};

export default THeadCurrencies;
