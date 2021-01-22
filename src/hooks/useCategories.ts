import useSWR from "swr";
import fetcher from "./fetcher";

import { Category } from "./../pages/Categories/types";

const useCategories = () => {
    const { data, mutate, error } = useSWR<Category[]>(
        `${process.env.REACT_APP_API}/admin/categories/`,
        fetcher
    );

    return {
        categories: data as Category[],
        isLoading: !error && !data,
        isError: error,

        pushCategory: async (category: Category) => {
            const createdCategory = await fetch(
                `${process.env.REACT_APP_API}/admin/categories/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(category),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...(data as Category[]), createdCategory]);
        },
    };
};

export default useCategories;
