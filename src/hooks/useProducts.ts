import useSWR from "swr";
import fetcher from "./fetcher";

import { Product } from "./../pages/Products/types";

const useProducts = () => {
    const { data, mutate, error } = useSWR<Product[]>(
        `${process.env.REACT_APP_API}/admin/products/`,
        fetcher
    );

    return {
        products: data as Product[],
        isLoading: !error && !data,
        isError: error,

        pushProduct: async (product: Product) => {
            const createdProduct: Product = await fetch(
                `${process.env.REACT_APP_API}/admin/products/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(product),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...(data as Product[]), createdProduct]);
        },

        deleteProduct: async (productId: number) => {
            await fetch(`${process.env.REACT_APP_API}/admin/products/delete/`, {
                method: "POST",
                body: JSON.stringify({ id: productId }),
                credentials: "include",
            });

            mutate([
                ...(data as Product[]).filter(
                    (product) => product.id !== productId
                ),
            ]);
        },
    };
};

export default useProducts;
