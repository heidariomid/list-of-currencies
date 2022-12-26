const ErrorBoundry = () => {
	return (
		<div className='relative mt-10'>
			<div
				role='status'
				className='relative p-4 space-y-4 w-full  rounded border border-gray-200 divide-y divide-gray-200 shadow  dark:divide-gray-700 md:p-6 dark:border-gray-700'
			>
				<div className='flex flex-col justify-between items-center'>
					<h1 className='uppercase font-bold'>API key has limited request per minute </h1>
					<h3 className='uppercase text-gray-600'>please wait for a minute </h3>
				</div>
			</div>
			,
		</div>
	);
};

export default ErrorBoundry;
