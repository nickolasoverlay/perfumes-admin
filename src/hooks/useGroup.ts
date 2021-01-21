import useSWR from "swr";
import fetcher from "./fetcher";

const useGroup = (id: string) => {
    const { data, error } = useSWR(
        `${process.env.REACT_APP_API}/admin/category_groups/${id}`,
        fetcher
    );

    return {
        group: data,
        isLoading: !error && !data,
        isError: error,
    };
};

export default useGroup;
