import useSWR from "swr";
import fetcher from "./fetcher";

import { Category } from "./../pages/Categories/types";

const useCategory = (id: string) => {
    const { data, mutate, error } = useSWR<Category>(
        `${process.env.REACT_APP_API}/admin/categories/${id}/`,
        fetcher
    );

    return {
        category: data as Category,
        isLoading: !error && !data,
        isError: error,

        updateCategory: async (category: Category) => {
            await fetch(
                `${process.env.REACT_APP_API}/admin/categories/update/`,
                {
                    method: "POST",
                    body: JSON.stringify(category),
                    credentials: "include",
                }
            );

            console.log({ ...data, ...category });
            mutate({ ...data, ...category });
        },
    };
};

export default useCategory;
