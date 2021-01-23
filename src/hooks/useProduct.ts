import useSWR from "swr";
import fetcher from "./fetcher";

import { Product } from "./../pages/Products/types";

const useProduct = (id: string) => {
    const { data, mutate, error } = useSWR<Product>(
        `${process.env.REACT_APP_API}/admin/products/${id}/`,
        fetcher
    );

    return {
        product: data as Product,
        isLoading: !error && !data,
        isError: error,

        updateProduct: async (product: Product) => {
            await fetch(`${process.env.REACT_APP_API}/admin/products/update/`, {
                method: "POST",
                body: JSON.stringify(product),
                credentials: "include",
            });

            console.log({ ...data, ...product });
            mutate({ ...data, ...product });
        },
    };
};

export default useProduct;
