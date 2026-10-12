import {faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {pageItems} from './pageItems';

export type PaginationProps = {
	total: number;
	currentPage: number;
	perPage: number;
	setCurrentPage: (page: number) => void;
	isPlaceholderData: boolean;
};

export {pageItems};

const Pagination = ({total, perPage, currentPage, setCurrentPage, isPlaceholderData}: PaginationProps) => {
	const totalPages = Math.ceil(total / perPage);
	const pages = pageItems(currentPage, totalPages);
	return (
		<div className='text-center justify-center transition-all ease-out duration-500 '>
			<div className='flex flex-row flex-wrap justify-center items-center gap-y-2 mb-10 '>
				{currentPage !== 1 && (
					<button
						onClick={() => setCurrentPage(1)}
						className='relative inline-flex cursor-pointer transition-all ease-out duration-500 items-center px-4  text-sm font-medium rounded-l-full text-gray-400  hover:text-green-500'
					>
						<FontAwesomeIcon className='w-4 h-4' icon={faAnglesLeft} />
					</button>
				)}
				{currentPage !== 1 && (
					<button
						onClick={() => setCurrentPage(currentPage - 1)}
						className=' relative transition-all cursor-pointer ease-out duration-500 inline-flex items-center px-4  text-sm font-medium rounded-r-full text-gray-400  hover:text-green-500'
					>
						<FontAwesomeIcon className='w-4 h-4' icon={faAngleLeft} />
					</button>
				)}
				{pages.map((page, index) =>
					page === 'ellipsis' ? (
						<span key={`ellipsis-${index}`} className='mx-2 text-gray-400'>
							…
						</span>
					) : (
						<button key={page} onClick={() => setCurrentPage(page)}>
							<div
								className={`${page === currentPage ? 'bg-green-500 px-6' : 'bg-gray-400'} hover:bg-green-500 cursor-pointer transition-all duration-500 flex mx-2 px-2 rounded-full text-center items-center justify-center text-white`}
							>
								{page}
							</div>
						</button>
					),
				)}
				{currentPage !== totalPages && (
					<button
						disabled={currentPage === totalPages || isPlaceholderData}
						onClick={() => {
							if (!isPlaceholderData) setCurrentPage(currentPage + 1);
						}}
						className=' relative inline-flex  cursor-pointer items-center px-4  text-sm font-medium rounded-r-full text-gray-400  hover:text-green-500'
					>
						<FontAwesomeIcon className='w-4 h-4' icon={faAngleRight} />
					</button>
				)}
				{currentPage !== totalPages && (
					<button
						onClick={() => setCurrentPage(totalPages)}
						className=' relative transition-all cursor-pointer ease-out duration-500 inline-flex items-center px-4  text-sm font-medium rounded-r-full text-gray-400  hover:text-green-500'
					>
						<FontAwesomeIcon className='w-4 h-4' icon={faAnglesRight} />
					</button>
				)}
			</div>
		</div>
	);
};

export default Pagination;
