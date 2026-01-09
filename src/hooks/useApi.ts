// import { useEffect, useState } from 'react';
//
// type ApiResponse<D> = {
// 	isLoading: boolean;
// 	isError: boolean;
// 	data: D | undefined;
// };
//
// export const useApi = <T>(fetcherOrUrl: string | Function) => {
// 	const [state, setState] = useState<ApiResponse<T>>({
// 		isLoading: true,
// 		isError: false,
// 		data: undefined,
// 	});
//
// 	const loadData = async () => {
// 		if (typeof fetcherOrUrl === 'string') {
// 			fetch(fetcherOrUrl)
// 				.then((response) => {
// 					if (response.ok) {
// 						return response.json();
// 					} else {
// 						setState({
// 							...state,
// 							isError: true,
// 						});
// 					}
// 				})
// 				.then((data) => {
// 					setState({
// 						...state,
// 						data: data,
// 						isLoading: false,
// 					});
// 				})
// 				.catch(() => {
// 					setState({
// 						...state,
// 						isError: true,
// 					});
// 				});
// 		} else {
// 			try {
// 				const result = await fetcherOrUrl();
// 				setState({
// 					data: result,
// 					isLoading: false,
// 					isError: false,
// 				});
// 			} catch {
// 				setState({
// 					...state,
// 					isError: true,
// 				});
// 			}
// 		}
// 	};
//
// 	useEffect(() => {
// 		loadData();
// 	}, []);
//
// 	return state;
// };
