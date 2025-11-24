import { useEffect, useState } from 'react';

type ApiResponse<D> = {
	isLoading: boolean;
	isError: boolean;
	data: D | undefined;
};

// const { isLoading, isError, data } = useApi<CharacterDto>('http://example.com');
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const useApi = <T>(fetcherOrUrl: string | Function) => {
	// fetcher: string | Function
	const [state, setState] = useState<ApiResponse<T>>({
		isLoading: true,
		isError: false,
		data: undefined,
	});

	const loadData = async () => {
		if (typeof fetcherOrUrl === 'string') {
			fetch(fetcherOrUrl) // fetcher()
				.then((response) => {
					if (response.ok) {
						return response.json();
					} else {
						setState({
							...state,
							isError: true,
						});
					}
				})
				.then((data) => {
					setState({
						...state,
						data: data, // data.results
						isLoading: false,
					});
				})
				.catch(() => {
					setState({
						...state,
						isError: true,
					});
				});
		} else {
			try {
				const result = await fetcherOrUrl();
				setState({
					data: result,
					isLoading: false,
					isError: false,
				});
			} catch {
				setState({
					...state,
					isError: true,
				});
			}
		}
	};

	useEffect(() => {
		loadData();
	}, []);

	return state;
};
