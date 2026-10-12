type ErrorBoundryProps = {
	reason?: 'rate-limit' | 'generic';
};

const ErrorBoundry = ({reason}: ErrorBoundryProps) => {
	const title = reason === 'rate-limit' ? 'Too many requests' : 'The list could not be loaded';
	const hint =
		reason === 'generic'
			? 'Try again in a moment.'
			: reason === 'rate-limit'
				? 'Wait a minute, then try again.'
				: 'If this is the per-minute limit, wait a minute and try again.';

	return (
		<div className='mt-10 w-full min-w-0'>
			<div role='alert' className='rounded-lg border border-gray-200 bg-white px-6 py-8 text-center dark:border-zinc-600 dark:bg-ocean'>
				<p className='text-base font-medium text-gray-900 dark:text-white'>{title}</p>
				<p className='mt-2 text-sm text-gray-600 dark:text-zinc-400'>{hint}</p>
			</div>
		</div>
	);
};

export default ErrorBoundry;
