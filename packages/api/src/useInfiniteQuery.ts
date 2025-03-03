import { useInfiniteQuery as _useInfiniteQuery } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketPaginatateableRequestCleaned,
    TSocketPaginateableEndpointNames,
    TSocketRequestInfiniteQueryOptions,
    TSocketRequestPayload,
} from '../types';
import { getQueryKeys } from './utils';

const useInfiniteQuery = <T extends TSocketPaginateableEndpointNames>(
    name: T,
    ...props: TSocketAcceptableProps<T, true, 'useInfiniteQuery'>
) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketPaginatateableRequestCleaned<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestInfiniteQueryOptions<T>) : undefined;
    const { send } = useAPI();

    const initial_offset = payload?.offset || 0;
    const limit = payload?.limit || 50;

    return _useInfiniteQuery(
        getQueryKeys(name, payload),

        ({ pageParam = 0 }) =>
            send(name, {
                ...payload,
                limit,
                offset: pageParam * limit + initial_offset,
            } as unknown as TSocketRequestPayload<T>),
        {
            ...options,
            getNextPageParam: options?.getNextPageParam ? options.getNextPageParam : (_lastPage, pages) => pages.length,
        } as TSocketRequestInfiniteQueryOptions<T>
    );
};

export default useInfiniteQuery;
