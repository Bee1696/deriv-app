import { useQuery as _useQuery } from '@tanstack/react-query';
import useAPI from './useAPI';
import type {
    TSocketAcceptableProps,
    TSocketEndpointNames,
    TSocketRequestPayload,
    TSocketRequestQueryOptions,
    TSocketResponseData,
} from '../types';
import { getQueryKeys } from './utils';

const useQuery = <T extends TSocketEndpointNames>(name: T, ...props: TSocketAcceptableProps<T, true>) => {
    const prop = props?.[0];
    const payload = prop && 'payload' in prop ? (prop.payload as TSocketRequestPayload<T>) : undefined;
    const options = prop && 'options' in prop ? (prop.options as TSocketRequestQueryOptions<T>) : undefined;
    const { send } = useAPI();

    return _useQuery<TSocketResponseData<T>, unknown>(getQueryKeys(name, payload), () => send(name, payload), options);
};

export default useQuery;
