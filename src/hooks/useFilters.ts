import useSWR from "swr";
import fetcher from "./fetcher";

import { Filter } from "./../pages/Filters/types";

const useFilters = () => {
    const { data, mutate, error } = useSWR<Filter[]>(
        `${process.env.REACT_APP_API}/admin/filters/`,
        fetcher
    );

    return {
        filters: data as Filter[],
        isLoading: !error && !data,
        isError: error,

        pushFilter: async (filter: Filter) => {
            const createdFilter = await fetch(
                `${process.env.REACT_APP_API}/admin/filters/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(filter),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...(data as Filter[]), createdFilter]);
        },
    };
};

export default useFilters;
