import useSWR from "swr";
import fetcher from "./fetcher";

const useGroups = () => {
    const { data, mutate, error } = useSWR(
        `${process.env.REACT_APP_API}/admin/category_groups/`,
        fetcher
    );

    return {
        groups: data,
        isLoading: !error && !data,
        isError: error,

        pushGroup: async (group: any) => {
            const createdGroup = await fetch(
                `${process.env.REACT_APP_API}/admin/category_groups/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(group),
                    credentials: "include",
                }
            ).then((res) => res.json());

            mutate([...data, createdGroup]);
        },
    };
};

export default useGroups;
