import useSWR from "swr";
import fetcher from "./fetcher";

import { Filter } from "./../pages/Filters/types";

const useFilter = (id: string) => {
    const { data, mutate, error } = useSWR<Filter>(
        `${process.env.REACT_APP_API}/admin/filters/${id}/`,
        fetcher
    );

    return {
        filter: data as Filter,
        isLoading: !error && !data,
        isError: error,

        updateFilter: async (filter: Filter) => {
            await fetch(`${process.env.REACT_APP_API}/admin/filters/update/`, {
                method: "POST",
                body: JSON.stringify(filter),
                credentials: "include",
            });

            mutate({ ...data, ...filter });
        },
    };
};

export default useFilter;
